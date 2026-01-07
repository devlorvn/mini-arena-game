import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayerSessionService {
  private sessions: Map<string, string> = new Map(); // socketId -> playerId

  bind(socketId: string, playerId: string) {
    this.sessions.set(socketId, playerId);
  }

  unbind(socketId: string) {
    this.sessions.delete(socketId);
  }

  getPlayerId(socketId: string): string | undefined {
    return this.sessions.get(socketId);
  }
}
