import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuid } from 'uuid';
import { PlayerService } from 'src/player/player.service';
import { RoomService } from 'src/room/room.service';
import { GAME_EVENTS } from './game.event';

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
  ) {}

  handleConnection(socket: Socket) {
    console.info(`Client connected: ${socket.id}`);
  }

  async handleDisconnect(socket: Socket) {
    console.info(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage(GAME_EVENTS.JOIN_ROOM)
  async handleJoinRoom(socket: Socket, payload: { roomId: string }) {
    const playerId = uuid();
    socket.data.playerId = playerId;
    socket.join(payload.roomId);

    await this.playerService.createPlayer(playerId);
    await this.roomService.addPlayer(payload.roomId, playerId);

    socket.emit(GAME_EVENTS.PLAYER_CREATED, { playerId });
  }

  @SubscribeMessage(GAME_EVENTS.INPUT)
  async handleInput(socket: Socket, payload: { dx: number; dy: number }) {
    const playerId = socket.data.playerId;
    if (!playerId) return;
    const state = await this.playerService.move(
      playerId,
      payload.dx,
      payload.dy,
    );

    this.server.emit(GAME_EVENTS.PLAYER_MOVED, { playerId, state });
  }
}
