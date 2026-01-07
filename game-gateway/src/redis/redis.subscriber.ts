import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { GameGateway } from 'src/gateway/game.gateway';

@Injectable()
export class RedisSubscriber implements OnModuleInit, OnModuleDestroy {
  private subscriber: Redis;

  constructor(private readonly gameGateway: GameGateway) {
    this.subscriber = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      // password: process.env.REDIS_PASSWORD || undefined,
    });
  }

  async onModuleInit() {
    try {
      await this.subscriber.psubscribe('room:*:snapshot');

      console.log('Redis subscribed: room:*:snapshot');

      this.subscriber.on(
        'pmessage',
        (pattern: string, channel: string, message: string) => {
          try {
            const snapshot = JSON.parse(message);

            // console.log(`[SNAPSHOT] room=${snapshot.roomId} tick=${snapshot.tick}`);

            this.gameGateway.emitSnapshot(snapshot.roomId, snapshot);
          } catch (error) {
            console.error('Error processing snapshot:', error);
          }
        },
      );
    } catch (error) {
      console.error('Error subscribing to Redis:', error);
    }
  }

  async onModuleDestroy() {
    await this.subscriber.quit();
  }
}
