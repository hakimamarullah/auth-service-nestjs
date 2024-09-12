import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PrismadbService } from '../prismadb/prismadb.service';
import { PrismadbModule } from '../prismadb/prismadb.module';
import {
  CachingModule,
  CachingService,
} from '@hakimamarullah/commonbundle-nestjs';

@Module({
  providers: [RolesService, PrismadbService, CachingService],
  controllers: [RolesController],
  imports: [PrismadbModule, CachingModule],
})
export class RolesModule {}
