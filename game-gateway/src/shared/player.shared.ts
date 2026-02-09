export interface PlayerInput {
  playerId: string;
  action: 'MOVE' | 'ATTACK' | 'DEFEND';
  timestamp: number;
  data: {
    dx?: number;
    dy?: number;
  };
}
