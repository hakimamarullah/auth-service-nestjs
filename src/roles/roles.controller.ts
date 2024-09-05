import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleRequest } from './dto/request/createRole.request';
import { ApiBaseResponse } from '../common/decorators/swagger.decorator';
import { PathDto } from './dto/request/pathDto.request';
import { Request } from 'express';
import { RoleSimpleResponse } from './dto/response/roleSimple.response';
import { getUsername } from '../common/utils/common.util';

@ApiTags('RolesController')
@ApiSecurity('bearer')
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
    @Req() req: Request,
  ) {
    return await this.rolesService.createBatchRoles(getUsername(req), roleDtos);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiBaseResponse({ model: RoleSimpleResponse, isArray: true })
  async getRoles() {
    return await this.rolesService.getAllRoles();
  }

  @Delete(':roleId')
  @ApiOperation({ summary: 'Delete role by id' })
  @ApiBaseResponse({ model: Map<string, any>, isArray: true })
  async deleteRoleById(@Param('roleId', ParseIntPipe) roleId: number) {
    return await this.rolesService.deleteRoleById(roleId);
  }

  @Post('paths')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Add paths to a role by role name' })
  @ApiBaseResponse({ model: Map<string, any>, isArray: true })
  @ApiBody({ type: PathDto })
  async getPathsByRoleId(@Body() pathDto: PathDto, @Req() req: Request) {
    return await this.rolesService.addAllPathToRole(getUsername(req), pathDto);
  }
}
