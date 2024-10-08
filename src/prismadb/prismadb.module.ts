import { Module } from '@nestjs/common';
import { PrismadbService } from './prismadb.service';

@Module({
  providers: [PrismadbService],
  exports: [PrismadbService],
})
export class PrismadbModule {}
