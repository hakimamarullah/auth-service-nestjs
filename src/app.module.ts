import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismadbModule } from './prismadb/prismadb.module';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { CachingModule } from './caching/caching.module';
import { EventsListenerModule } from './events-listener/events-listener.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    AuthModule,
    UsersModule,
    PrismadbModule,
    RolesModule,
    CachingModule,
    EventsListenerModule,
  ],
})
export class AppModule {}
