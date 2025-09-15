import React, { useEffect, useRef } from 'react';

interface Bot {
  id: string;
  name: string;
  frame?: any;
  weapon?: any;
  armour?: any;
  ecotech?: any;
}

interface ArenaCanvasProps {
  bots: Bot[];
}

const ArenaCanvas: React.FC<ArenaCanvasProps> = ({ bots }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw bots as colored circles with names
    bots.forEach((bot, i) => {
      ctx.beginPath();
      ctx.arc(100 + i * 180, 140, 40, 0, 2 * Math.PI);
      ctx.fillStyle = '#3dd68c';
      ctx.fill();
      ctx.strokeStyle = '#eebf63';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#232946';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(bot.name, 100 + i * 180, 145);
    });
    // TODO: Draw ecosystem entities here
  }, [bots]);

  return (
    <div className="arena-area" style={{
      background: '#181c2f',
      borderRadius: 12,
      margin: '0 auto 24px auto',
      width: '100%',
      maxWidth: 900,
      minHeight: 320,
      boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={280}
        style={{ background: '#232946', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
      >
        Arena simulation not supported
      </canvas>
    </div>
  );
};

export default ArenaCanvas;
