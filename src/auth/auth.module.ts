import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { PrismadbService } from '../prismadb/prismadb.service';
import { JwtModule } from '@nestjs/jwt';

import { JwtConfigService } from './jwt-config.service';
import { RolesService } from '../roles/roles.service';
import { JwtController } from './jwt.controller';
import { CachingService } from '@hakimamarullah/commonbundle-nestjs';

@Module({
  providers: [
    AuthService,
    UsersService,
    PrismadbService,
    CachingService,
    JwtConfigService,
    RolesService,
  ],
  controllers: [AuthController, JwtController],
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [],
      useClass: JwtConfigService,
    }),
  ],
})
export class AuthModule {}
