import { Injectable, Logger } from '@nestjs/common';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as process from 'process';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  private readonly logger = new Logger(JwtConfigService.name);
  constructor(private configService: ConfigService) {}

  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    const config = {
      secret: this.configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: this.configService.get<string>('JWT_EXPIRES') },
      verifyOptions: {
        ignoreExpiration: false,
      },
      global: true,
    };
    if (!config.secret || !config.signOptions) {
      this.logger.fatal('JWT_SECRET or JWT_EXPIRES is not defined');
      process.exit(1);
    }
    return config;
  }
}
