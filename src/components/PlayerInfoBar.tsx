import React from 'react';

type PlayerInfoBarProps = {
  round: number;
  health: number;
  armor: number;
};

const PlayerInfoBar: React.FC<PlayerInfoBarProps> = ({ round, health, armor }) => (
  <div className="player-info-bar" style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    color: '#fff',
    padding: '32px 0 32px 0',
    width: '100%',
    marginBottom: 0,
    border: 'none',
    boxShadow: 'none',
    position: 'relative',
    minHeight: 120,
    gap: 48
  }}>
    {/* Left: Round */}
    <div style={{ minWidth: 80, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', gap: 0 }}>
      <span style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, color: '#fff' }}>{round}</span>
      <span style={{ fontSize: 13, fontWeight: 500, letterSpacing: 1, color: '#bbb', marginTop: 2 }}>ROUND</span>
    </div>
    {/* Center: Armor - PFP - Health */}
    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 32, maxWidth: 400 }}>
      {/* Armor left of PFP */}
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 20, fontWeight: 400 }}>
        <span role="img" aria-label="armor" style={{ fontSize: 24, color: '#fff' }}>🦾</span>
        {armor}
      </span>
      {/* PFP */}
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#38ff2b', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 8px #232323', margin: '0 0 0 0' }} />
      {/* Health right of PFP */}
      <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 20, fontWeight: 400 }}>
        {health}
        <span role="img" aria-label="health" style={{ fontSize: 24, color: '#fff' }}>❤️</span>
      </span>
    </div>
    {/* Spacer for symmetry */}
    <div style={{ minWidth: 120 }} />
  </div>
);

export default PlayerInfoBar;
