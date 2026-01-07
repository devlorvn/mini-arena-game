import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  async onModuleInit() {
    this.client = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      // password: process.env.REDIS_PASSWORD || undefined,
    });
  }

  async onModuleDestroy() {
    this.client.quit();
  }

  getClient() {
    return this.client;
  }

  async pushGameInput(roomId: string, payload: any) {
    await this.client.lpush(`game:input:${roomId}`, JSON.stringify(payload));
  }

  async getQueueLength(roomId: string): Promise<number> {
    return this.client.llen(`game:input:${roomId}`);
  }

  // Note: Game Engine publishes snapshots directly to Redis
  // Gateway only subscribes via RedisSubscriber
}
