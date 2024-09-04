import { Injectable } from '@nestjs/common';
import { PrismadbService } from '../prismadb/prismadb.service';
import { CreateRoleRequest } from './dto/request/createRole.request';
import { BaseResponse } from '../dto/baseResponse.dto';

@Injectable()
export class RolesService {
  constructor(private prismadbService: PrismadbService) {}

  async createBatchRoles(roleDtos: CreateRoleRequest[]) {
    const createdRoles = await this.prismadbService.role.createManyAndReturn({
      data: roleDtos,
    });

    return BaseResponse.getResponseCreated<any>(createdRoles);
  }

  async getAllRoles() {
    const roles = await this.prismadbService.role.findMany();
    return BaseResponse.getSuccessResponse<any>(roles);
  }

  async deleteRoleById(roleId: number) {
    const role = await this.prismadbService.role.delete({
      where: {
        id: roleId,
      },
    });
    return BaseResponse.getSuccessResponse<any>(role);
  }
}
