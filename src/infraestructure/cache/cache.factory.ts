import { ICacheService } from '../../domain/ports/cache.interface';
import { RedisCacheService } from './redis.cache';

export enum CacheType {
  REDIS = 'redis',
  // Aquí puedes agregar más tipos de caché en el futuro
}

export class CacheFactory {
  static create(type: CacheType): ICacheService {
    switch (type) {
      case CacheType.REDIS:
        return new RedisCacheService();
      default:
        throw new Error(`Unsupported cache type: ${type}`);
    }
  }
} 