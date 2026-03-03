export interface Player {
  id: string;
  x: number;
  y: number;
  hp: number;
}

export interface GameSnapshot {
  roomId: string;
  tick: number;
  timestamp: number;
  players: Record<string, Player>;
}

export interface MovePayload {
  dx: number;
  dy: number;
}

export interface ConnectedPayload {
  playerId: string;
  roomId: string;
}
