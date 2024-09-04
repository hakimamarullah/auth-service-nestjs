import { Module } from '@nestjs/common';
import { CachingService } from './caching.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  providers: [CachingService],
  imports: [
    CacheModule.register({ isGlobal: true, store: 'memory', ttl: 600000 }),
  ],
})
export class CachingModule {}
