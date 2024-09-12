import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '@hakimamarullah/commonbundle-nestjs';

@ApiTags('HealthcheckController')
@Public()
@Controller('health')
export class HealthcheckController {
  @Get()
  @ApiOperation({ summary: 'Get healthcheck' })
  @ApiResponse({ status: 200, description: 'OK' })
  async ping() {
    return { status: 'ok' };
  }
}
