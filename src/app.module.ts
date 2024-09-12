import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismadbModule } from './prismadb/prismadb.module';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { EventsListenerModule } from './events-listener/events-listener.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './auth/jwt-config.service';
import { RolesService } from './roles/roles.service';
import {
  CachingModule,
  CachingService,
} from '@hakimamarullah/commonbundle-nestjs';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    JwtModule.registerAsync({
      imports: [],
      useClass: JwtConfigService,
    }),
    AuthModule,
    UsersModule,
    PrismadbModule,
    RolesModule,
    CachingModule,
    EventsListenerModule,
  ],
  providers: [
    CachingService,

    RolesService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
