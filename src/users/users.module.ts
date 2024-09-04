import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismadbService } from '../prismadb/prismadb.service';

@Module({
  controllers: [UsersController],
  exports: [UsersService],
  providers: [UsersService, PrismadbService],
})
export class UsersModule {}
