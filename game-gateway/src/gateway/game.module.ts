import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { RedisModule } from 'src/redis/redis.module';
import { RedisSubscriber } from 'src/redis/redis.subscriber';
import { PlayerService } from 'src/player/player.service';
import { RoomService } from 'src/room/room.service';
import { RoomSessionService } from 'src/room/room-session.service';
import { PlayerSessionService } from 'src/player/player-session.service';

@Module({
  providers: [
    GameGateway,
    RedisSubscriber,
    PlayerService,
    RoomService,
    RoomSessionService,
    PlayerSessionService,
  ],
  imports: [RedisModule],
})
export class GameModule {}
