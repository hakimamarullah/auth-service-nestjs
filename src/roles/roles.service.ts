import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismadbService } from '../prismadb/prismadb.service';
import { CreateRoleRequest } from './dto/request/createRole.request';
import { PathDto } from './dto/request/pathDto.request';
import { RoleSimpleResponse } from './dto/response/roleSimple.response';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventConstant } from '../events-listener/event-key.constant';
import {
  BaseResponse,
  CachingService,
} from '@hakimamarullah/commonbundle-nestjs';

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

    return BaseResponse.getResponse<any>(createdRoles, undefined, 201);
  }

  async getAllRoles() {
    const roles = await this.prismadbService.role.findMany({
      include: { PathAllowed: true },
    });
    const data = roles.map((role: any) => RoleSimpleResponse.build(role));
    return BaseResponse.getResponse<RoleSimpleResponse[]>(data);
  }

  async deleteRoleById(roleId: number) {
    const role = await this.prismadbService.role.delete({
      where: {
        id: roleId,
      },
    });
    return BaseResponse.getResponse<any>(role);
  }
  async loadAllPaths<T>(
    transformer?: (data: string) => Promise<T>,
  ): Promise<{ [roleName: string]: T[] }> {
    const roles = await this.prismadbService.role.findMany({
      include: { PathAllowed: true },
    });

    const result: { [roleName: string]: T[] } = {};

    for (const role of roles) {
      result[role.name] = await Promise.all(
        (role as any).PathAllowed.map(async (pathAllowed: any) => {
          if (transformer) {
            return transformer(pathAllowed.path);
          }
          return pathAllowed.path as T;
        }),
      );
    }

    return result;
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
    return BaseResponse.getResponse('Success');
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
    return BaseResponse.getResponse(data);
  }

  async onModuleInit(): Promise<any> {
    this.logger.log(`Loading roles from database...`);
    this.emitter.emit(EventConstant.EventKey.RELOAD_ALL_PATHS);
    this.logger.log(`Loaded roles from database.`);
  }
}
