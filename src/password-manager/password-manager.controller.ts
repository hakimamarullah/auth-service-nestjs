import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PasswordManagerService } from './password-manager.service';
import { ApiBaseResponse, Public } from '@hakimamarullah/commonbundle-nestjs';

@ApiTags('Password Manager')
@Controller('password-manager')
export class PasswordManagerController {
  constructor(private passwordManagerService: PasswordManagerService) {}

  @Get('/reset/:email')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request Password Reset' })
  @ApiBaseResponse({ model: Object })
  @ApiParam({ name: 'email', type: String })
  async requestPasswordReset(@Param('email') email: string) {
    return await this.passwordManagerService.requestPasswordReset(email);
  }
}
