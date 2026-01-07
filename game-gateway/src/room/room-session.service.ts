import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomSessionService {
  private sessions: Map<string, string> = new Map(); // socketId -> roomId

  join(playerId: string, roomId: string) {
    this.sessions.set(playerId, roomId);
  }

  leave(playerId: string) {
    this.sessions.delete(playerId);
  }

  getRoomId(playerId: string): string | undefined {
    return this.sessions.get(playerId);
  }
}
