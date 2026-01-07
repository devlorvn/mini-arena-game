import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    // password: process.env.REDIS_PASSWORD || undefined,
  });

  getClient() {
    return this.client;
  }
  async onModuleDestroy() {
    // Initialization logic for Redis connection can be added here
  }

  async pushGameInput(roomId: string, payload: any) {
    await this.client.rpush(`game:input:${roomId}`, JSON.stringify(payload));
  }
}
