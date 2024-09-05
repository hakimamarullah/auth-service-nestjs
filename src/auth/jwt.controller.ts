import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtConfigService } from './jwt-config.service';
import { ApiBaseResponse } from '../common/decorators/swagger.decorator';
import { JwtConfigResponse } from './dto/response/jwtConfig.response';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from '../dto/baseResponse.dto';

@ApiSecurity('bearer')
@ApiTags('bearer')
@Controller('jwt')
export class JwtController {
  constructor(private jwtConfigService: JwtConfigService) {}

  @Get('config')
  @ApiOperation({ summary: 'Get jwt config' })
  @ApiBaseResponse({ model: JwtConfigResponse })
  @HttpCode(HttpStatus.OK)
  async getJwtConfig() {
    const data = this.jwtConfigService.loadJwtOptions() as JwtConfigResponse;
    return BaseResponse.getSuccessResponse(data);
  }
}
