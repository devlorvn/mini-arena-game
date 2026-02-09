import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { randomUUID } from 'crypto';
import { PlayerService } from 'src/player/player.service';
import { RoomService } from 'src/room/room.service';
import { GAME_EVENTS, PlayerInputEvent } from './game.event';
import { RedisService } from 'src/redis/redis.service';
import { PlayerSessionService } from 'src/player/player-session.service';
import { RoomSessionService } from 'src/room/room-session.service';
import { PlayerInput } from 'src/shared/player.shared';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(
    private playerService: PlayerService,
    private roomService: RoomService,
    private redisService: RedisService,
    private playerSession: PlayerSessionService,
    private roomSession: RoomSessionService,
  ) {}

  handleConnection(socket: Socket) {
    console.info(`Client connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket) {
    console.info(`Client disconnected: ${socket.id}`);

    // Clean up sessions
    const playerId = this.playerSession.getPlayerId(socket.id);
    if (playerId) {
      this.playerSession.unbind(socket.id);
      this.roomSession.leave(playerId);
    }
  }

  @SubscribeMessage(GAME_EVENTS.JOIN_ROOM)
  async handleJoinRoom(socket: Socket, payload: { roomId: string }) {
    try {
      const playerId = randomUUID();
      socket.data.playerId = playerId;
      socket.join(payload.roomId);

      // Bind player session
      this.playerSession.bind(socket.id, playerId);
      this.roomSession.join(playerId, payload.roomId);

      await this.playerService.createPlayer(playerId);
      await this.roomService.addPlayer(payload.roomId, playerId);

      socket.emit(GAME_EVENTS.PLAYER_CREATED, { playerId });
      console.info(`Player ${playerId} joined room ${payload.roomId}`);
    } catch (error) {
      console.error('Error joining room:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  }

  @SubscribeMessage(GAME_EVENTS.INPUT)
  async handleInput(socket: Socket, payload: { dx: number; dy: number }) {
    try {
      const playerId = this.playerSession.getPlayerId(socket.id);
      if (!playerId) return;

      const roomId = this.roomSession.getRoomId(playerId);
      if (!roomId) return;

      // Push to Redis queue for game engine to process

      const data: PlayerInput = {
        playerId,
        action: 'MOVE',
        data: {
          dx: payload.dx,
          dy: payload.dy,
        },
        timestamp: Date.now(),
      };
      await this.redisService.pushGameInput(roomId, data);
    } catch (error) {
      console.error('Error handling input:', error);
    }
  }

  emitSnapshot(roomId: string, snapshot: any) {
    this.server.to(roomId).emit('game:snapshot', snapshot);
  }
}
