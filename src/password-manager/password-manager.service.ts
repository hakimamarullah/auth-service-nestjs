import { Injectable } from '@nestjs/common';
import { PrismadbService } from '../prismadb/prismadb.service';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { ProducerService } from '@hakimamarullah/event-producer';
import {
  BaseResponse,
  HtmlTemplateService,
} from '@hakimamarullah/commonbundle-nestjs';

@Injectable()
export class PasswordManagerService {
  constructor(
    private prismaService: PrismadbService,
    private configService: ConfigService,
    private producerService: ProducerService,
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
    const params = new Map();
    params.set('RESET_LINK', url);
    params.set('EMAIL', email);
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
    };
    await this.producerService.sendToQueue(
      this.configService.get('SEND_EMAIL_QUEUE', 'send-email-queue'),
      JSON.stringify(payload),
    );
    return BaseResponse.getResponse(null, 'Password reset link sent');
  }
}
