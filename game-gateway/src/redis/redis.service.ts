import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client = new Redis({
    host: 'localhost',
    port: 6379,
  });

  getClient() {
    return this.client;
  }
  async onModuleDestroy() {
    // Initialization logic for Redis connection can be added here
  }
}
