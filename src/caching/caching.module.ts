import { Module } from '@nestjs/common';
import { CachingService } from './caching.service';
import { CacheModule } from '@nestjs/cache-manager';
import cachingConfig from '../common/config/caching.config';

@Module({
  providers: [CachingService],
  imports: [CacheModule.register(cachingConfig)],
})
export class CachingModule {}
