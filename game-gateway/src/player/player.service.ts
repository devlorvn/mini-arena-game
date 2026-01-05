import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class PlayerService {
  constructor(private redisClient: RedisService) {}

  async createPlayer(
    playerId: string,
    playerData: any = { x: 0, y: 0, hp: 100 },
  ) {
    await this.redisClient.getClient().hset(`player:${playerId}`, playerData);
  }

  async move(playerId: string, dx: number, dy: number) {
    const redis = this.redisClient.getClient();
    await redis.hincrby(`player:${playerId}`, 'x', dx);
    await redis.hincrby(`player:${playerId}`, 'y', dy);
  }
}
