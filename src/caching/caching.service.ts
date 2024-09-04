import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheConstant } from './cache.constant';

@Injectable()
export class CachingService {
  private logger: Logger = new Logger(CachingService.name);
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setRoles(userId: any, roles: string[] | undefined) {
    return await this.set<string[]>(
      `${CacheConstant.CacheKey.ROLES}_${userId}`,
      roles ?? [],
    );
  }

  async get<T>(key: string) {
    return await this.wrapper(() => this.cacheManager.get<T>(key));
  }

  async set<T>(key: string, value: T) {
    return await this.wrapper(() => this.cacheManager.set(key, value));
  }

  async del(key: string) {
    return await this.wrapper(() => this.cacheManager.del(key));
  }

  async reset() {
    return await this.wrapper(() => this.cacheManager.reset());
  }

  private async wrapper<T>(fn: () => Promise<T>) {
    try {
      return await fn();
    } catch (error) {
      this.logger.debug(error);
    }
  }
}
