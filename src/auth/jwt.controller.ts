import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtConfigService } from './jwt-config.service';
import { JwtConfigResponse } from './dto/response/jwtConfig.response';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiBaseResponse,
  BaseResponse,
} from '@hakimamarullah/commonbundle-nestjs';

@ApiBearerAuth()
@ApiTags('JWT Utility')
@Controller('jwt')
export class JwtController {
  constructor(private jwtConfigService: JwtConfigService) {}

  @Get('config')
  @ApiOperation({ summary: 'Get jwt config' })
  @ApiBaseResponse({ model: JwtConfigResponse })
  @HttpCode(HttpStatus.OK)
  async getJwtConfig() {
    const data = this.jwtConfigService.loadJwtOptions() as JwtConfigResponse;
    return BaseResponse.getResponse(data);
  }
}
