import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PasswordManagerService } from './password-manager.service';
import { ApiBaseResponse, Public } from '@hakimamarullah/commonbundle-nestjs';
import { ResetPasswordRequest } from './dto/reset-password.request';

@ApiTags('Password Manager')
@Public()
@Controller('password-manager')
export class PasswordManagerController {
  constructor(private passwordManagerService: PasswordManagerService) {}

  @Get('/reset/:email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request Password Reset' })
  @ApiBaseResponse({ model: Object })
  @ApiParam({ name: 'email', type: String })
  async requestPasswordReset(@Param('email') email: string) {
    return await this.passwordManagerService.requestPasswordReset(email);
  }

  @Get('/token/:token/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate Password Reset Token' })
  @ApiBaseResponse({ model: Object })
  @ApiParam({ name: 'token', type: String })
  async validatePasswordResetToken(@Param('token') token: string) {
    return await this.passwordManagerService.validatePasswordResetToken(token);
  }

  @Post('/reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset Password' })
  @ApiBaseResponse({ model: Object })
  @ApiBody({ type: ResetPasswordRequest })
  async resetPassword(@Body() req: ResetPasswordRequest) {
    return await this.passwordManagerService.resetPassword(req);
  }
}
