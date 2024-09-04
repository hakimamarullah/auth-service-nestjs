import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleRequest } from './dto/request/createRole.request';
import { ApiBaseResponse } from '../common/decorators/swagger.decorator';

@ApiTags('RolesController')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Create roles in batch' })
  @ApiBaseResponse({ model: Map<string, any>, isArray: true })
  @ApiBody({ type: CreateRoleRequest, isArray: true })
  async createBatchRoles(
    @Body(new ParseArrayPipe({ items: CreateRoleRequest }))
    roleDtos: CreateRoleRequest[],
  ) {
    return await this.rolesService.createBatchRoles(roleDtos);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiBaseResponse({ model: Map<string, any>, isArray: true })
  async getRoles() {
    return await this.rolesService.getAllRoles();
  }

  @Delete(':roleId')
  @ApiOperation({ summary: 'Delete role by id' })
  @ApiBaseResponse({ model: Map<string, any>, isArray: true })
  async deleteRoleById(@Param('roleId', ParseIntPipe) roleId: number) {
    return await this.rolesService.deleteRoleById(roleId);
  }
}
