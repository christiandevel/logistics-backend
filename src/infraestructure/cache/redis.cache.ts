import { createClient } from 'redis';
import { ICacheService } from '../../domain/ports/cache.interface';
import dotenv from 'dotenv';

dotenv.config();

export class RedisCacheService implements ICacheService {
  private client;

  constructor() {
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
      password: process.env.REDIS_PASSWORD || undefined,
      username: process.env.REDIS_USERNAME || undefined,
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.client.connect('connect', () => { console.log('Redis connected');});
  }

  async get<T>(key: string): Promise<T | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.client.set(key, value, { EX: ttl });
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async clear(): Promise<void> {
    await this.client.flushAll();
  }

  async disconnect(): Promise<void> {
    await this.client.quit();
  }
} 