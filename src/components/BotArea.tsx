import React from 'react';
import ShopCard from './ShopCard';

interface BotAreaProps {
  bots: any[];
  handleDropOnBot: (botIdx: number, slot: 'frame' | 'weapon' | 'ecotech' | 'armour', e: React.DragEvent) => void;
  setBots: React.Dispatch<React.SetStateAction<any[]>>;
  setInventory: React.Dispatch<React.SetStateAction<any[]>>;
}

const BotArea: React.FC<BotAreaProps> = ({ bots, handleDropOnBot, setBots, setInventory }) => (
  <div className="bot-area">
    {bots.map((bot, idx) => (
      <div
        className="bot-card bot-card--summary"
        key={bot.id}
        draggable
        onDragStart={e => {
          e.dataTransfer.setData('application/bot', JSON.stringify({ botIdx: idx }));
        }}
        onDragOver={e => {
          const data = e.dataTransfer.getData('application/json');
          if (data) {
            try {
              const item = JSON.parse(data);
              if (
                (item.type === 'frame' && !bot.frame) ||
                (item.type === 'weapon' && bot.frame && !bot.weapon) ||
                (item.type === 'armour' && bot.frame && !bot.armour) ||
                (item.type === 'ecotech' && bot.frame && !bot.ecotech)
              ) {
                e.preventDefault();
              }
            } catch {}
          }
        }}
        onDrop={e => {
          const data = e.dataTransfer.getData('application/json');
          if (!data) return;
          try {
            const item = JSON.parse(data);
            if (item.type === 'frame' && !bot.frame) {
              handleDropOnBot(idx, 'frame', e);
            } else if (item.type === 'weapon' && bot.frame && !bot.weapon) {
              handleDropOnBot(idx, 'weapon', e);
            } else if (item.type === 'armour' && bot.frame && !bot.armour) {
              handleDropOnBot(idx, 'armour', e);
            } else if (item.type === 'ecotech' && bot.frame && !bot.ecotech) {
              handleDropOnBot(idx, 'ecotech', e);
            }
          } catch {}
        }}
      >
        <div className="bot-summary-title">{bot.name}</div>
        <div className="bot-summary-wt">WT {bot.frame?.stats?.find((s: {label: string, value: string | number}) => s.label === 'WT')?.value ?? 0}</div>
        <div className="bot-summary-parts">
          <div className="bot-part-bar bot-part-bar--frame"><span className="bot-part-bar__label">{bot.frame?.name}</span></div>
          <div className="bot-part-bar bot-part-bar--weapon"><span className="bot-part-bar__label">{bot.weapon?.name}</span></div>
          <div className="bot-part-bar bot-part-bar--armour"><span className="bot-part-bar__label">{bot.armour?.name}</span></div>
          <div className="bot-part-bar bot-part-bar--ecotech"><span className="bot-part-bar__label">{bot.ecotech?.name}</span></div>
        </div>
      </div>
    ))}
    {/* + slot for new bot (accepts only frame) */}
    <div
      className="bot-card bot-card--add"
      onDragOver={e => {
        const data = e.dataTransfer.getData('application/json');
        if (data) {
          try {
            const item = JSON.parse(data);
            if (item.type === 'frame') e.preventDefault();
          } catch {}
        }
      }}
      onDrop={e => {
        const data = e.dataTransfer.getData('application/json');
        if (!data) return;
        try {
          const item = JSON.parse(data);
          if (item.type === 'frame') {
            setInventory(inv => inv.filter((i: any) => i.id !== item.id));
            setBots((prev: any[]) => ([
              ...prev,
              {
                id: `bot-${prev.length + 1}`,
                name: `Bot ${prev.length + 1}`,
                frame: { ...item, stats: item.stats || [] }
              }
            ]));
          }
        } catch {}
      }}
      tabIndex={0}
    >
      <div className="bot-add-plus">+</div>
    </div>
  </div>
);

export default BotArea;
