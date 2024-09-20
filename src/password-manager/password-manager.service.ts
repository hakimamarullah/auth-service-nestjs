import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismadbService } from '../prismadb/prismadb.service';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import {
  BaseResponse,
  hashPassword,
  HtmlTemplateService,
} from '@hakimamarullah/commonbundle-nestjs';
import { ResetTokenStatus } from '@prisma/client';
import { ResetPasswordRequest } from './dto/reset-password.request';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventConstant } from '../events-listener/event-key.constant';

@Injectable()
export class PasswordManagerService {
  constructor(
    private prismaService: PrismadbService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
    private htmlTemplateService: HtmlTemplateService,
  ) {}

  async requestPasswordReset(email: string) {
    await this.prismaService.user.findFirstOrThrow({
      where: {
        email: email.toLowerCase(),
      },
    });

    const token = uuidv4();
    const url = `${this.configService.get('FE_RESET_PASSWORD_URL')}/${token}`;

    await this.prismaService.resetToken.create({
      data: {
        email,
        token,
      },
    });
    const params = {
      RESET_LINK: url,
      EMAIL: email,
    };
    const subject = 'Password Reset Request';
    const html = this.htmlTemplateService.fillTemplate(
      'reset_password',
      params,
    );

    const payload = {
      subject,
      recipients: [email],
      textBody: html,
      isHtml: true,
      queue: this.configService.get('SEND_EMAIL_QUEUE', 'send-email-queue'),
    };

    this.eventEmitter.emit(EventConstant.EventKey.SEND_EMAIL, payload);
    return BaseResponse.getResponse(null, 'Password reset link sent');
  }

  async validatePasswordResetToken(token: string) {
    const data = (await this.prismaService.resetToken.findFirst({
      where: {
        token,
      },
    })) as any;

    if (data?.status !== ResetTokenStatus.ACTIVE) {
      return BaseResponse.getResponse(
        { valid: false, email: data?.email },
        'Token Is Not Active. Please request token again',
        HttpStatus.BAD_REQUEST,
      );
    }
    const createdAt = data.createdAt;

    const diff = Date.now() - createdAt.getTime();
    const threshold = 1000 * 60 * 60 * 24 * 2;
    const isExpired = diff > threshold;
    if (isExpired) {
      await this.prismaService.resetToken.update({
        where: {
          token,
        },
        data: {
          status: ResetTokenStatus.EXPIRED,
        },
      });
      return BaseResponse.getResponse(
        { valid: false, email: data.email },
        'Token expired',
        HttpStatus.BAD_REQUEST,
      );
    }

    return BaseResponse.getResponse({ valid: true, email: data.email });
  }

  async resetPassword(req: ResetPasswordRequest) {
    const { responseCode, responseData } =
      await this.validatePasswordResetToken(req.token);
    if (responseCode !== 200) {
      return BaseResponse.getResponse('xx', 'Invalid token', 400);
    }

    const hashedNewPassword = hashPassword(req.newPassword);
    const { email } = responseData ?? {};

    await this.prismaService.user.update({
      where: {
        email: email.toLowerCase(),
      },
      data: {
        password: hashedNewPassword,
      },
    });

    await this.prismaService.resetToken.update({
      where: {
        token: req.token,
      },
      data: {
        status: ResetTokenStatus.USED,
      },
    });

    const subject = 'Password Reset Successful';
    const message = 'Your password has been reset successfully';
    const payload = {
      subject,
      recipients: [email],
      textBody: message,
      isHtml: false,
      queue: this.configService.get('SEND_EMAIL_QUEUE', 'send-email-queue'),
    };

    this.eventEmitter.emit(EventConstant.EventKey.SEND_EMAIL, payload);
    return BaseResponse.getResponse(null, 'Password reset successfully');
  }
}
