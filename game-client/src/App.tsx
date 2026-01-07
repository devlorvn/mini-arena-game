import { useGameConnection } from './hooks/useGameConnection';
import { GameCanvas } from './components/GameCanvas';
import { Controls } from './components/Controls';
import './App.css';

function App() {
  const serverUrl = import.meta.env.VITE_GATEWAY_URL || 'http://localhost:3456';
  const { connected, playerId, roomId, snapshot, move } = useGameConnection(serverUrl);

  return (
    <div className="app">
      <header>
        <h1>🎮 Realtime Multiplayer Arena</h1>
        <div className="status">
          <span className={connected ? 'connected' : 'disconnected'}>
            {connected ? '🟢 Connected' : '🔴 Disconnected'}
          </span>
          {playerId && <span>Player: {playerId.slice(-8)}</span>}
          {roomId && <span>Room: {roomId}</span>}
          {snapshot && <span>Tick: {snapshot.tick}</span>}
        </div>
      </header>

      <main>
        <GameCanvas
          players={snapshot?.players || {}}
          currentPlayerId={playerId}
        />
        <Controls onMove={move} />
      </main>

      <footer>
        <div className="stats">
          <div>Players: {snapshot ? Object.keys(snapshot.players).length : 0}</div>
          <div>Latency: {snapshot ? Date.now() - snapshot.timestamp : 0}ms</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
