import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismadbService } from '../prismadb/prismadb.service';
import { CreateRoleRequest } from './dto/request/createRole.request';
import { BaseResponse } from '../dto/baseResponse.dto';
import { CachingService } from '../caching/caching.service';
import { PathDto } from './dto/request/pathDto.request';
import { convertPatternToRegExp } from '../common/utils/common.util';
import { RoleSimpleResponse } from './dto/response/roleSimple.response';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventConstant } from '../events-listener/event-key.constant';

@Injectable()
export class RolesService implements OnModuleInit {
  private logger: Logger = new Logger(RolesService.name);
  constructor(
    private prismadbService: PrismadbService,
    private cachingService: CachingService,
    private emitter: EventEmitter2,
  ) {}

  async createBatchRoles(username: string, roleDtos: CreateRoleRequest[]) {
    const createdRoles = await this.prismadbService.role.createManyAndReturn({
      data: roleDtos.map((role) => ({ ...role, createBy: username })),
    });

    return BaseResponse.getResponseCreated<any>(createdRoles);
  }

  async getAllRoles() {
    const roles = await this.prismadbService.role.findMany({
      include: { PathAllowed: true },
    });
    const data = roles.map((role: any) => RoleSimpleResponse.build(role));
    return BaseResponse.getSuccessResponse<RoleSimpleResponse[]>(data);
  }

  async deleteRoleById(roleId: number) {
    const role = await this.prismadbService.role.delete({
      where: {
        id: roleId,
      },
    });
    return BaseResponse.getSuccessResponse<any>(role);
  }

  async loadAllPaths<T>(
    transformer?: (data: any) => T,
  ): Promise<{ [roleName: string]: T[] }> {
    // Fetch all roles with the given names and include PathAllowed
    const roles = await this.prismadbService.role.findMany({
      include: { PathAllowed: true }, // Include the related PathAllowed records
    });

    // Map roles to their allowed paths
    return roles.reduce(
      (acc, role: any) => {
        acc[role.name] = role.PathAllowed.map((pathAllowed: any) => {
          if (transformer) {
            return transformer(pathAllowed.path);
          }
          return pathAllowed.path;
        });
        return acc;
      },
      {} as { [roleName: string]: T[] },
    );
  }

  async addAllPathToRole(username: string, pathDto: PathDto) {
    await this.prismadbService.role.update({
      where: {
        name: pathDto.roleName,
      },
      data: {
        PathAllowed: {
          create: pathDto.paths.map((path) => ({ path, createBy: username })),
        },
      },
    });
    this.emitter.emit(EventConstant.EventKey.RELOAD_ALL_PATHS);
    return BaseResponse.getSuccessResponse('Success');
  }

  async getUserRoles(userId: number) {
    const roles = await this.prismadbService.userRoles.findMany({
      where: {
        userId,
      },
      include: {
        role: true,
      },
    });
    const data = roles.map((role: any) => role.role?.name);
    return BaseResponse.getSuccessResponse(data);
  }

  async onModuleInit(): Promise<any> {
    this.logger.log(`Loading roles from database...`);
    this.emitter.emit(EventConstant.EventKey.RELOAD_ALL_PATHS);
    this.logger.log(`Loaded roles from database.`);
  }
}
