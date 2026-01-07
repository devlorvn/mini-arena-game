import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { GameSnapshot, ConnectedPayload } from '../types/game.types';

export const useGameConnection = (serverUrl: string) => {
  const [connected, setConnected] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<GameSnapshot | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(serverUrl, {
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✓ Connected to game server');
      setConnected(true);
      
      // Auto join lobby room
      socket.emit('join_room', { roomId: 'lobby' });
    });

    socket.on('disconnect', () => {
      console.log('✗ Disconnected from game server');
      setConnected(false);
    });

    socket.on('player_created', (data: ConnectedPayload) => {
      console.log('Player created:', data);
      setPlayerId(data.playerId);
      setRoomId(data.roomId);
    });

    socket.on('game:snapshot', (data: GameSnapshot) => {
      setSnapshot(data);
    });

    socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, [serverUrl]);

  const move = (dx: number, dy: number) => {
    console.log("move")
    if (socketRef.current && connected) {
      socketRef.current.emit('input', { dx, dy });
    }
  };

  return {
    connected,
    playerId,
    roomId,
    snapshot,
    move,
  };
};
