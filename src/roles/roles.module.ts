import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PrismadbService } from '../prismadb/prismadb.service';
import { PrismadbModule } from '../prismadb/prismadb.module';

@Module({
  providers: [RolesService, PrismadbService],
  controllers: [RolesController],
  imports: [PrismadbModule],
})
export class RolesModule {}
