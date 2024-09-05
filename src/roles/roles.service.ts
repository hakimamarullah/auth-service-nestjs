import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismadbService } from '../prismadb/prismadb.service';
import { CreateRoleRequest } from './dto/request/createRole.request';
import { BaseResponse } from '../dto/baseResponse.dto';
import { CachingService } from '../caching/caching.service';
import { CacheConstant } from '../caching/cache.constant';
import { PathDto } from './dto/request/pathDto.request';
import { convertPatternToRegExp } from '../common/utils/common.util';
import { RoleSimpleResponse } from './dto/response/roleSimple.response';

@Injectable()
export class RolesService implements OnApplicationBootstrap {
  private logger: Logger = new Logger(RolesService.name);
  constructor(
    private prismadbService: PrismadbService,
    private cachingService: CachingService,
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

  async loadAllPaths(): Promise<{ [roleName: string]: string[] }> {
    // Fetch all roles with the given names and include PathAllowed
    const roles = await this.prismadbService.role.findMany({
      include: { PathAllowed: true }, // Include the related PathAllowed records
    });

    // Map roles to their allowed paths
    const pathsByRoleName = roles.reduce(
      (acc, role: any) => {
        acc[role.name] = role.PathAllowed.map((pathAllowed: any) =>
          convertPatternToRegExp(pathAllowed.path),
        );
        return acc;
      },
      {} as { [roleName: string]: string[] },
    );
    await this.cachingService.set(
      `${CacheConstant.CacheKey.ROLES_PATHS}`,
      pathsByRoleName,
    );
    return pathsByRoleName;
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

    return BaseResponse.getSuccessResponse('Success');
  }

  async onApplicationBootstrap(): Promise<any> {
    this.logger.log(`Loading roles from database...`);
    await this.loadAllPaths();
    this.logger.log(`Loaded roles from database.`);
  }
}
