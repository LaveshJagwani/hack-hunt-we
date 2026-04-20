import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    this.client = new Redis({
      host: this.configService.get<string>('redis.host', 'localhost'),
      port: this.configService.get<number>('redis.port', 6379),
      password: this.configService.get<string>('redis.password'),
      db: this.configService.get<number>('redis.db', 0),
      maxRetriesPerRequest: null,
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client.status !== 'end') {
      await this.client.quit();
    }
  }

  get redis(): Redis {
    return this.client;
  }

  async ping(): Promise<string> {
    return this.client.ping();
  }

  async getJson<T>(key: string): Promise<T | null> {
    const payload = await this.client.get(key);
    if (!payload) {
      return null;
    }

    return JSON.parse(payload) as T;
  }

  async setJson<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async delByPrefix(prefix: string): Promise<void> {
    const stream = this.client.scanStream({
      match: `${prefix}*`,
      count: 100,
    });

    for await (const chunk of stream) {
      const keys = chunk as string[];
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    }
  }
}
