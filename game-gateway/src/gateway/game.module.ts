import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { RedisModule } from 'src/redis/redis.module';
import { PlayerService } from 'src/player/player.service';
import { RoomService } from 'src/room/room.service';

@Module({
  providers: [GameGateway, PlayerService, RoomService],
  imports: [RedisModule],
})
export class GameModule {}
