import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { PrismadbService } from '../prismadb/prismadb.service';
import { PrismadbModule } from '../prismadb/prismadb.module';
import { CachingService } from '../caching/caching.service';
import { CachingModule } from '../caching/caching.module';

@Module({
  providers: [RolesService, PrismadbService, CachingService],
  controllers: [RolesController],
  imports: [PrismadbModule, CachingModule],
})
export class RolesModule {}
