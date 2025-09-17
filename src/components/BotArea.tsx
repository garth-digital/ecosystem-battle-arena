
import React from 'react';
import { InventoryItem } from '../App';
import '../styles/botArea.css';

interface BotSlot {
  type: 'weapon' | 'armour' | 'ecotech';
  part?: InventoryItem;
  x: number;
  y: number;
}

interface Bot {
  id: string;
  name: string;
  frameType: string;
  maxWeight: number;
  slots: BotSlot[];
  rarity: string;
  frameStats: Array<{label: string, value: number | string}>;
}

interface BotAreaProps {
  bots: Bot[];
  setBots: React.Dispatch<React.SetStateAction<Bot[]>>;
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

const createBotFromFrame = (frame: InventoryItem): Bot => {
  const frameData = {
    light: {
      slots: [
        { type: 'weapon' as const, x: 0, y: 0 },
        { type: 'armour' as const, x: 1, y: 0 }
      ],
      maxWeight: 60
    },
    medium: {
      slots: [
        { type: 'weapon' as const, x: 0, y: 0 },
        { type: 'armour' as const, x: 1, y: 0 },
        { type: 'ecotech' as const, x: 0, y: 1 }
      ],
      maxWeight: 90
    },
    heavy: {
      slots: [
        { type: 'weapon' as const, x: 0, y: 0 },
        { type: 'armour' as const, x: 1, y: 0 },
        { type: 'weapon' as const, x: 0, y: 1 },
        { type: 'ecotech' as const, x: 1, y: 1 }
      ],
      maxWeight: 120
    }
  };

  const frameType = frame.name.toLowerCase().includes('heavy') ? 'heavy' 
                 : frame.name.toLowerCase().includes('light') ? 'light'
                 : 'medium';

  return {
    id: `bot-${Date.now()}`,
    name: `Bot ${frame.name}`,
    frameType,
    maxWeight: frameData[frameType].maxWeight,
    slots: frameData[frameType].slots.map(s => ({ ...s, part: undefined })),
    rarity: frame.rarity,
    frameStats: frame.stats || []
  };
};

const BotArea: React.FC<BotAreaProps> = ({ bots, setBots, setInventory }) => {
  const getNumericStat = (item: InventoryItem | undefined, stat: string): number => {
    if (!item?.stats) return 0;
    const value = item.stats.find(s => s.label === stat)?.value;
    return typeof value === 'string' ? parseFloat(value) : (value || 0);
  };

  const calculateBotWeight = (bot: Bot) => {
    let totalWeight = 0;
    bot.slots.forEach(slot => {
      if (slot.part) {
        totalWeight += getNumericStat(slot.part, 'WT');
      }
    });
    return totalWeight;
  };

  const canEquipPart = (bot: Bot, part: InventoryItem) => {
    // Check if there's a matching empty slot
    const matchingSlot = bot.slots.find(slot => slot.type === part.type && !slot.part);
    if (!matchingSlot) return false;

    // Check weight limits
    const totalWeight = calculateBotWeight(bot);
    const partWeight = getNumericStat(part, 'WT');
    
    return (totalWeight + partWeight) <= bot.maxWeight;
  };

  const handlePartDragStart = (e: React.DragEvent, bot: Bot, slotIndex: number) => {
    const slot = bot.slots[slotIndex];
    if (!slot.part) return;
    
    e.dataTransfer.setData('application/json', JSON.stringify(slot.part));
    // Remove the part from the bot and add to inventory on next frame
    setTimeout(() => {
      setBots((prev: Bot[]) => prev.map(b => 
        b.id === bot.id ? {
          ...b,
          slots: b.slots.map((s, i) => i === slotIndex ? { ...s, part: undefined } : s)
        } : b
      ));
      setInventory((prev: InventoryItem[]) => [...prev, slot.part!]);
    }, 0);
  };

  const handlePartDrop = (e: React.DragEvent, bot: Bot, slotIndex: number) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;
    
    try {
      const part: InventoryItem = JSON.parse(data);
      const slot = bot.slots[slotIndex];
      if (part.type !== slot.type) return;

      if (canEquipPart(bot, part)) {
        if (slot.part) {
          // If there's already a part in this slot, add it back to inventory
          setInventory(prev => [...prev, slot.part!]);
        }
        setInventory(prev => prev.filter(i => i.id !== part.id));
        setBots(prev => prev.map(b => 
          b.id === bot.id ? {
            ...b,
            slots: b.slots.map((s, i) => i === slotIndex ? { ...s, part } : s)
          } : b
        ));
      }
    } catch {}
  };

  return (
    <div className="bot-area-section">
      <div className="bot-area">
        {bots.map((bot: Bot, idx: number) => {
          const weight = calculateBotWeight(bot);
          const weightClass = weight <= 50 ? '' : weight <= 80 ? 'warning' : 'danger';
          
          return (
            <div
              className="bot-card bot-card--universal"
              key={bot.id}
              draggable
              onDragStart={(e) => {
                // Allow dragging bot for either unequipping items or selling
                e.dataTransfer.setData('application/bot', JSON.stringify({
                  id: bot.id,
                  botWithParts: bot
                }));
              }}
              onDragOver={(e) => {
                const data = e.dataTransfer.getData('application/json');
                if (data) {
                  try {
                    const item = JSON.parse(data);
                    if (['weapon', 'armour', 'ecotech'].includes(item.type)) {
                      if (canEquipPart(bot, item)) {
                        e.preventDefault();
                        e.currentTarget.classList.add('bot-card--drag-over');
                      }
                    }
                  } catch {}
                }
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('bot-card--drag-over');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('bot-card--drag-over');
                const data = e.dataTransfer.getData('application/json');
                if (!data) return;
                
                try {
                  const item: InventoryItem = JSON.parse(data);
                  
                  if (canEquipPart(bot, item)) {
                    // Find the first empty slot that matches this item type
                    const slotIndex = bot.slots.findIndex(slot => slot.type === item.type && !slot.part);
                    if (slotIndex !== -1) {
                      setInventory(prev => prev.filter(i => i.id !== item.id));
                      setBots(prev => prev.map(b => 
                        b.id === bot.id ? {
                          ...b,
                          slots: b.slots.map((s, i) => i === slotIndex ? { ...s, part: item } : s)
                        } : b
                      ));
                    }
                  }
                } catch {}
              }}
            >
              <div className="bot-card__weight-container">
                <div className={`bot-card__weight bot-card__weight--${weightClass}`}>
                  <span role="img" aria-label="weight" style={{marginRight: 2}}>⚖️</span>
                  {weight}/{bot.maxWeight}
                </div>
              </div>
              <div className="bot-card__weight-gauge">
                <div 
                  className={`bot-card__weight-gauge-fill bot-card__weight-gauge-fill--${weightClass}`}
                  style={{
                    height: `${(weight / bot.maxWeight * 100) || 0}%`
                  }}
                />
              </div>
              <div className="bot-card__name">{bot.name}</div>
              <div className="bot-card__parts-grid">
                {bot.slots.map((slot, i) => {
                  const hasPart = !!slot.part;
                  let background = '#18181b';
                  let labelBg = 'var(--color-common)';
                  let labelColor = '#232323';
                  let partType = slot.type;
                  let partName = '';
                  let partWeight = 0;

                  if (hasPart && slot.part) {
                    partName = slot.part.name;
                    const wtVal = slot.part.stats?.find(s => s.label === 'WT')?.value;
                    partWeight = typeof wtVal === 'number' ? wtVal : (typeof wtVal === 'string' ? parseFloat(wtVal) : 0);
                    
                    if (slot.type === 'weapon') {
                      background = 'var(--color-weapon)';
                      labelBg = 'var(--color-weapon)';
                    } else if (slot.type === 'armour') {
                      background = 'var(--color-armor)';
                      labelBg = 'var(--color-armor)';
                    } else if (slot.type === 'ecotech') {
                      background = 'var(--color-ecotech)';
                      labelBg = 'var(--color-ecotech)';
                    }
                    
                    if (slot.part.rarity === 'common') {
                      labelColor = '#232323';
                    }
                  }

                  return (
                    <div
                      key={i}
                      className={`bot-card__part-slot bot-card__part-slot--${slot.type}`}
                      style={{
                        border: hasPart ? '2px solid var(--color-gold)' : '2px dashed #444',
                        background,
                        color: labelColor,
                        cursor: hasPart ? 'pointer' : 'default',
                      }}
                      draggable={hasPart}
                      onDragStart={(e) => {
                        if (hasPart) {
                          handlePartDragStart(e, bot, i);
                        }
                      }}
                      onClick={() => {
                        if (hasPart) {
                          setBots((prev: Bot[]) => prev.map((b: Bot) => 
                            b.id === bot.id ? {
                              ...b,
                              slots: b.slots.map((s, idx) => 
                                idx === i ? { ...s, part: undefined } : s
                              )
                            } : b
                          ));
                          if (slot.part) {
                            setInventory((inv: InventoryItem[]) => [...inv, slot.part!]);
                          }
                        }
                      }}
                    >
                      {hasPart ? (
                        <div className="bot-card__part-content">
                          <div 
                            className="bot-card__part-type-label inventory-type-label"
                            style={{
                              background: labelBg,
                              color: labelColor
                            }}
                          >
                            {partType}
                          </div>
                          <div className="bot-card__part-name">{partName}</div>
                          <div className="bot-card__part-weight">
                            <span role="img" aria-label="weight">⚖️</span> {partWeight}
                          </div>
                        </div>
                      ) : (
                        <div className="bot-card__part-empty">+</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
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
              const frame: InventoryItem = JSON.parse(data);
              if (frame.type === 'frame') {
                // Convert the frame into a new bot
                setInventory((inv: InventoryItem[]) => 
                  inv.filter((i: InventoryItem) => i.id !== frame.id)
                );
                setBots((prev: Bot[]) => ([
                  ...prev,
                  createBotFromFrame(frame)
                ]));
              }
            } catch {}
          }}
          tabIndex={0}
        >
          <div className="bot-add-plus">+</div>
        </div>
      </div>
    </div>
  );
};

export default BotArea;
