import React from 'react';

type PlayerInfoBarProps = {
  round: number;
  health: number;
  armor: number;
  view: 'shop' | 'arena';
  setView: (v: 'shop' | 'arena') => void;
};

const PlayerInfoBar: React.FC<PlayerInfoBarProps> = ({ round, health, armor, view, setView }) => (
  <div className="player-info-bar" style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#232946',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '0 0 12px 12px',
    marginBottom: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  }}>
    <div style={{ display: 'flex', gap: 32 }}>
      <div><strong>Round:</strong> {round}</div>
      <div><strong>Health:</strong> {health}</div>
      <div><strong>Armor:</strong> {armor}</div>
    </div>
    <div style={{ display: 'flex', gap: 12 }}>
      <button
        style={{
          background: view === 'arena' ? '#eebf63' : '#232946',
          color: view === 'arena' ? '#232946' : '#eebf63',
          border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginRight: 8
        }}
        onClick={() => setView('arena')}
      >Arena</button>
      <button
        style={{
          background: view === 'shop' ? '#eebf63' : '#232946',
          color: view === 'shop' ? '#232946' : '#eebf63',
          border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer', marginRight: 8
        }}
        onClick={() => setView('shop')}
      >Shop</button>
      <button style={{
        background: '#3dd68c', color: '#232946', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 700, fontSize: 16, cursor: 'pointer'
      }}>Start Battle</button>
    </div>
  </div>
);

export default PlayerInfoBar;
