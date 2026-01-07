import { useEffect } from 'react';

interface ControlsProps {
  onMove: (dx: number, dy: number) => void;
}

export const Controls = ({ onMove }: ControlsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const speed = 5;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          onMove(0, -speed);
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          onMove(0, speed);
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          onMove(-speed, 0);
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          onMove(speed, 0);
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onMove]);

  return (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <h3>🎮 Controls</h3>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          padding: '20px',
          background: '#1a1a1a',
          borderRadius: '12px',
          border: '2px solid #333',
          maxWidth: '400px',
          margin: '10px auto',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>⌨️</div>
        
        <div style={{ display: 'flex', gap: '30px', fontSize: '14px' }}>
          <div style={keyGroupStyle}>
            <div style={keyStyle}>W</div>
            <div style={keyStyle}>A</div>
            <div style={keyStyle}>S</div>
            <div style={keyStyle}>D</div>
          </div>
          
          <div style={{ color: '#666', fontSize: '20px', alignSelf: 'center' }}>or</div>
          
          <div style={keyGroupStyle}>
            <div style={keyStyle}>↑</div>
            <div style={keyStyle}>←</div>
            <div style={keyStyle}>↓</div>
            <div style={keyStyle}>→</div>
          </div>
        </div>

        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
          Press keys to move your character
        </p>
      </div>
    </div>
  );
};

const keyGroupStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '8px',
};

const keyStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#2a2a2a',
  border: '2px solid #444',
  borderRadius: '8px',
  fontSize: '20px',
  fontWeight: 'bold',
  boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
};
