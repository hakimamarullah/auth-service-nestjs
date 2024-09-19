import { Module } from '@nestjs/common';
import { PasswordManagerService } from './password-manager.service';
import { PasswordManagerController } from './password-manager.controller';
import { PrismadbService } from '../prismadb/prismadb.service';
import { ProducerService } from '@hakimamarullah/event-producer';
import { HtmlTemplateModule } from '@hakimamarullah/commonbundle-nestjs';
import { join } from 'path';

@Module({
  providers: [PasswordManagerService, PrismadbService, ProducerService],
  controllers: [PasswordManagerController],
  imports: [
    HtmlTemplateModule.register({
      assetsDir: join(__dirname, '..', '..', 'assets'),
    }),
  ],
})
export class PasswordManagerModule {}
