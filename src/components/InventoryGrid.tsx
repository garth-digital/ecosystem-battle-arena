import React from 'react';
import { InventoryItem } from '../App';
import './shop.css';
import './colors.css';


interface InventoryGridProps {
  inventory: InventoryItem[];
  onDragStart?: (item: InventoryItem, e: React.DragEvent) => void;
  onDropFromShop?: (item: InventoryItem) => void;
  setBots?: React.Dispatch<React.SetStateAction<any[]>>;
  setInventory?: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

interface BotDragData {
  id: string;
  botWithParts: Bot;
}

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

const InventoryGrid: React.FC<InventoryGridProps> = ({ 
  inventory, 
  onDragStart, 
  onDropFromShop, 
  setBots,
  setInventory
}) => {
  const [dragOver, setDragOver] = React.useState(false);
  return (
    <div
      className={"inventory-section" + (dragOver ? " inventory-section--dragover" : "")}
      onDragOver={e => {
        if (e.dataTransfer.types.includes('application/json') || 
            e.dataTransfer.types.includes('application/bot')) {
          setDragOver(true);
          e.preventDefault();
        }
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => {
        setDragOver(false);
        const shopData = e.dataTransfer.getData('application/json');
        const botData = e.dataTransfer.getData('application/bot');
        
        if (shopData) {
          try {
            const item = JSON.parse(shopData);
            if (onDropFromShop) onDropFromShop(item);
          } catch {}
        } else if (botData && setBots && setInventory) {
          try {
            const { id, botWithParts } = JSON.parse(botData);
            
            // Add all equipped parts back to inventory
            const partsToAdd: InventoryItem[] = [];
            botWithParts.slots.forEach((slot: BotSlot) => {
              if (slot.part) {
                partsToAdd.push(slot.part);
              }
            });
            
            if (partsToAdd.length > 0) {
              // First drop: only unequip parts
              setInventory(prev => [...prev, ...partsToAdd]);
              setBots(prev => prev.map(bot => 
                bot.id === id ? {
                  ...bot,
                  slots: bot.slots.map((slot: BotSlot) => ({ ...slot, part: undefined }))
                } : bot
              ));
            } else {
              // Second drop: remove the empty bot
              setBots(prev => prev.filter(bot => bot.id !== id));
            }
          } catch {}
        }
      }}
    >
      <div className="inventory-grid">
        {inventory.length === 0 ? (
          <div className="inventory-empty">Inventory is empty</div>
        ) : (
          inventory.map(item => (
            <div
              key={item.id}
              className={`inventory-slot inventory-slot--square inventory-slot--${item.rarity}`}
              draggable
              onDragStart={e => onDragStart && onDragStart(item, e)}
            >
              <div
                className={`inventory-item inventory-item--square inventory-item--${item.rarity}`}
                style={{
                  borderColor:
                    item.rarity === 'mythic' ? 'var(--color-border-mythic)' :
                    item.rarity === 'rare' ? 'var(--color-border-rare)' :
                    'var(--color-border-common)',
                  background:
                    item.type === 'weapon' ? 'var(--color-weapon)' :
                    item.type === 'armour' ? 'var(--color-armor)' :
                    item.type === 'ecotech' ? 'var(--color-ecotech)' :
                    item.type === 'frame' ? 'var(--color-bot)' :
                    'var(--color-common)',
                  color: item.rarity === 'common' ? '#232323' : '#fff',
                  aspectRatio: '1/1',
                  padding: '4px',
                  overflow: 'hidden',
                  minWidth: '56px',
                  minHeight: '56px',
                  maxWidth: '56px',
                  maxHeight: '56px',
                  boxSizing: 'border-box',
                }}
              >
                <div className="inventory-item__type-label inventory-type-label" style={{
                  background:
                    item.type === 'weapon' ? 'var(--color-weapon)' :
                    item.type === 'armour' ? 'var(--color-armor)' :
                    item.type === 'ecotech' ? 'var(--color-ecotech)' :
                    item.type === 'frame' ? 'var(--color-bot)' :
                    'var(--color-common)',
                  color: item.type === 'frame' ? '#fff' : '#232323',
                }}>{item.type}</div>
                <div className="inventory-item__name">{item.name}</div>
                <div className="inventory-item__weight-box">
                  <span role="img" aria-label="weight" style={{fontSize:'1em',verticalAlign:'middle'}}>⚖️</span> {item.stats?.find(s => s.label === 'WT')?.value ?? 0}
                </div>
                <div className="inventory-item__gold-box">
                  <span className="gold-icon" role="img" aria-label="gold" style={{color:'var(--color-gold)',fontWeight:700}}>●</span> {item.cost}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryGrid;
