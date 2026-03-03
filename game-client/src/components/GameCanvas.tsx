import { useEffect, useRef } from 'react';
import type { Player } from '../types/game.types';

interface GameCanvasProps {
  players: Record<string, Player>;
  currentPlayerId: string | null;
}

export const GameCanvas = ({ players, currentPlayerId }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw players
    Object.values(players).forEach((player) => {
      const isCurrentPlayer = player.id === currentPlayerId;
      
      // Draw player circle
      ctx.beginPath();
      ctx.arc(player.x, player.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = isCurrentPlayer ? '#00ff00' : '#ff0000';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw player ID (last 8 chars)
      ctx.fillStyle = '#fff';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      const shortId = player.id.length > 8 ? player.id.slice(-8) : player.id;
      ctx.fillText(shortId, player.x, player.y - 30);

      // Draw HP bar
      const hpBarWidth = 40;
      const hpBarHeight = 6;
      ctx.fillStyle = '#333';
      ctx.fillRect(
        player.x - hpBarWidth / 2,
        player.y + 25,
        hpBarWidth,
        hpBarHeight
      );
      ctx.fillStyle = player.hp > 50 ? '#00ff00' : player.hp > 25 ? '#ffaa00' : '#ff0000';
      ctx.fillRect(
        player.x - hpBarWidth / 2,
        player.y + 25,
        (hpBarWidth * player.hp) / 100,
        hpBarHeight
      );
    });
  }, [players, currentPlayerId]);

  return (
    <canvas
      ref={canvasRef}
      width={1000}
      height={1000}
      style={{
        border: '2px solid #333',
        background: '#1a1a1a',
        maxWidth: '100%',
        height: 'auto',
      }}
    />
  );
};
