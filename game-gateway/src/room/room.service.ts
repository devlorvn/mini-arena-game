import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class RoomService {
  constructor(private redis: RedisService) {}
  async addPlayer(roomId: string, playerId: string) {
    await this.redis.getClient().sadd(`room:${roomId}:players`, playerId);
  }

  async getPlayers(roomId: string): Promise<string[]> {
    return this.redis.getClient().smembers(`room:${roomId}:players`);
  }
}
