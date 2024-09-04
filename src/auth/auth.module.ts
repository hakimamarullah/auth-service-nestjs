import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { PrismadbService } from '../prismadb/prismadb.service';
import { JwtModule } from '@nestjs/jwt';
import { CachingService } from '../caching/caching.service';

import { JwtConfigService } from './jwt-config.service';

@Module({
  providers: [
    AuthService,
    UsersService,
    PrismadbService,
    CachingService,
    JwtConfigService,
  ],
  controllers: [AuthController],
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [],
      useClass: JwtConfigService,
    }),
  ],
})
export class AuthModule {}
