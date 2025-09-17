// Helper to map ShopCardProps to InventoryItem
const mapShopCardToInventory = (item: ShopCardProps): InventoryItem => ({
  id: `${item.name}-${item.rarity}-${item.type}`,
  name: item.name,
  description: item.description,
  rarity: item.rarity,
  type: (item.type.toLowerCase() as InventoryItem['type']) || 'frame',
  cost: item.cost,
  currency: item.currency,
  stats: item.stats || [],
  size: item.size,
  highlight: item.highlight,
});

import React from 'react';
import ShopCard, { ShopCardProps } from './ShopCard';
import { InventoryItem, SellableItem } from '../App';
import './shop.css';
import './shopButtons.css';
import './shopCards.css';

type ShopGridItem = ShopCardProps | { blank: true };

// Example data for 9 shop slots
const exampleShopItems: ShopCardProps[] = [
  // Frame
  {
    name: 'Steel Frame',
    description: 'Basic bot frame, sturdy and reliable.',
    rarity: 'common',
    type: 'frame',
    cost: 3,
    currency: 'gold',
    stats: [
      { label: 'HP', value: 100 },
      { label: 'WT', value: 50 }
    ],
    size: 'LAR',
    highlight: true
  },
  // Weapon
  {
    name: 'Thorn Thrower',
    description: 'Throws explosive thorn pods that explode on contact.',
    rarity: 'common',
    type: 'weapon',
    cost: 2,
    currency: 'gold',
    stats: [
      { label: 'DMG', value: 25 },
      { label: 'COOL', value: '4s' }
    ],
    size: 'SML',
    highlight: false
  },
  // Ecotech
  {
    name: 'Nano Repair Matrix',
    description: 'Repairs bot over time.',
    rarity: 'rare',
    type: 'ecotech',
    cost: 5,
    currency: 'gold',
    stats: [
      { label: 'REGEN', value: 5 },
      { label: 'WT', value: 10 }
    ],
    size: 'SML',
    highlight: false
  },
  // Armour
  {
    name: 'Titanium Plating',
    description: 'Heavy armor for maximum protection.',
    rarity: 'rare',
    type: 'armour',
    cost: 4,
    currency: 'gold',
    stats: [
      { label: 'DEF', value: 40 },
      { label: 'WT', value: 30 }
    ],
    size: 'SML',
    highlight: false
  },
  // Mythic Frame
  {
    name: 'Quantum Frame',
    description: 'A frame that bends space-time.',
    rarity: 'mythic',
    type: 'frame',
    cost: 12,
    currency: 'gold',
    stats: [
      { label: 'HP', value: 200 },
      { label: 'WT', value: 30 }
    ],
    size: 'LAR',
    highlight: true
  },
  // Mythic Weapon
  {
    name: 'Plasma Lance',
    description: 'Unleashes a devastating plasma beam.',
    rarity: 'mythic',
    type: 'weapon',
    cost: 10,
    currency: 'gold',
    stats: [
      { label: 'DMG', value: 100 },
      { label: 'COOL', value: '8s' }
    ],
    size: 'SML',
    highlight: false
  },
  // Mythic Ecotech
  {
    name: 'Singularity Core',
    description: 'Generates infinite energy.',
    rarity: 'mythic',
    type: 'ecotech',
    cost: 11,
    currency: 'gold',
    stats: [
      { label: 'REGEN', value: 20 },
      { label: 'WT', value: 5 }
    ],
    size: 'SML',
    highlight: false
  },
  // Mythic Armour
  {
    name: 'Aegis Shield',
    description: 'Legendary shield that blocks all damage for 2s.',
    rarity: 'mythic',
    type: 'armour',
    cost: 9,
    currency: 'gold',
    stats: [
      { label: 'DEF', value: 100 },
      { label: 'WT', value: 20 }
    ],
    size: 'SML',
    highlight: false
  },
  // Filler
  {
    name: 'Basic Plating',
    description: 'Simple armor for new bots.',
    rarity: 'common',
    type: 'armour',
    cost: 1,
    currency: 'gold',
    stats: [
      { label: 'DEF', value: 10 }
    ],
    size: 'SML',
    highlight: false
  }
];



type ShopGridProps = {
  onPurchase: (item: InventoryItem, cost: number) => void;
  shopItems: ShopGridItem[];
  gold: number;
  unlocked: {
    frame: boolean;
    armour: boolean;
    weapon: boolean;
    rare: boolean;
    mythic: boolean;
  };
  onUnlock: (key: keyof ShopGridProps['unlocked']) => void;
  onReroll: (type: string) => void;
  onSell: (item: SellableItem) => void;
};

const ShopGrid: React.FC<ShopGridProps> = ({ onPurchase, shopItems, gold, unlocked, onUnlock, onReroll, onSell }) => {
  // Helper to render a locked reroll button
  const CoinIcon = ({size=22,stroke=3,color='var(--color-gold)'}: {size?:number,stroke?:number,color?:string}) => (
    <svg width={size} height={size} viewBox="0 0 32 32" style={{verticalAlign:'middle'}}>
      <circle cx="16" cy="16" r="13" fill="none" stroke={color} strokeWidth={stroke} />
    </svg>
  );

  const RerollIcon = ({size=22, color="#444"}: {size?:number, color?:string}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{display:'block',margin:'0 auto'}}>
      <path d="M12 4V1L7 6l5 5V7c3.31 0 6 2.69 6 6 0 1.3-.42 2.5-1.13 3.47" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const lockedBtn = (label: string, key: keyof typeof unlocked, style: React.CSSProperties, reactKey?: string) => (
    <button
      className="reroll-btn reroll-btn--locked"
      style={style}
      onClick={() => onUnlock(key)}
      key={reactKey}
    >
      <span className="coin-badge"><span className="coin-badge__bg" /><span className="coin-badge__amount">10</span></span>
      <div className="reroll-btn__lock-flex">
        <span role="img" aria-label="locked" style={{fontSize:20,opacity:0.7,filter:'drop-shadow(0 1px 2px #0008)'}}>🔒</span>
        <span className="reroll-btn__label" style={{opacity:0.7}}>{label}</span>
      </div>
    </button>
  );

  // Always show 9 cells in the grid (3x3 block)
  const gridItems = shopItems.slice(0, 9);
  while (gridItems.length < 9) gridItems.push({ blank: true });

  return (
    <div className="shop-grid-wrapper">
      <div className="shop-grid">
        {/* 3x3 shop cards in top-left */}
        {gridItems.map((item, idx) => {
          const row = Math.floor(idx / 3) + 1;
          const col = (idx % 3) + 1;
          // Use a unique key for each cell
          let key = `cell-${idx}`;
          if ('name' in item && item.name) {
            key = `cell-${idx}-${item.name}-${item.type}-${item.rarity}`;
          } else if ('blank' in item && item.blank) {
            key = `cell-${idx}-blank`;
          }
          return (
            <div
              className="shop-grid__cell"
              key={key}
              style={{ gridRow: row, gridColumn: col }}
            >
              {'blank' in item && item.blank ? (
                <div style={{ width: '100%', height: '100%', background: 'rgba(80,80,80,0.15)', borderRadius: 8 }} />
              ) : (
                <ShopCard
                  {...item as ShopCardProps}
                  onClick={(item as ShopCardProps).name ? () => onPurchase(mapShopCardToInventory(item as ShopCardProps), (item as ShopCardProps).cost) : undefined}
                  draggable={!!(item as ShopCardProps).name}
                  onDragStart={(item as ShopCardProps).name ? (e) => { e.dataTransfer.setData('application/json', JSON.stringify(mapShopCardToInventory(item as ShopCardProps))); } : undefined}
                />
              )}
            </div>
          );
        })}
        {/* Vertical buttons in rightmost column (col 4, rows 1-3) */}
        {([
          ['mythic', 1],
          ['rare', 2],
          ['all', 3]
        ] as [string, number][]).map(([type, row], i) => {
          const key = `vertical-btn-${type}-${row}`;
          if (type === 'all') {
            return (
              <button
                key={key}
                className="reroll-btn reroll-btn--common reroll-btn--vertical"
                style={{ gridRow: row, gridColumn: 4 }}
                onClick={() => onReroll('all')}
              >
                <span className="coin-badge"><span className="coin-badge__bg" /><span className="coin-badge__amount">5</span></span>
                <span style={{display:'block',marginTop:24,marginBottom:2}}><RerollIcon size={18} color="#444" /></span>
                <span className="reroll-btn__label reroll-btn__label--centered">ALL</span>
              </button>
            );
          }
          const unlockedKey = type as keyof typeof unlocked;
          const label = (type as string).toUpperCase();
          return unlocked[unlockedKey]
            ? (
                <button
                  key={key}
                  className={`reroll-btn reroll-btn--${type} reroll-btn--vertical`}
                  style={{ gridRow: row, gridColumn: 4 }}
                  onClick={() => onReroll(type as string)}
                >
                  <span className="coin-badge"><span className="coin-badge__bg" /><span className="coin-badge__amount">10</span></span>
                  <RerollIcon size={18} color="#444" />
                  <span className="reroll-btn__label">{label}</span>
                </button>
              )
            : (
                <button
                  className="reroll-btn reroll-btn--locked reroll-btn--vertical"
                  style={{ gridRow: row, gridColumn: 4 }}
                  onClick={() => onUnlock(unlockedKey)}
                  key={key}
                >
                  <span className="coin-badge"><span className="coin-badge__bg" /><span className="coin-badge__amount">10</span></span>
                  <span role="img" aria-label="locked" style={{fontSize:20,opacity:0.7,filter:'drop-shadow(0 1px 2px #0008)'}}>🔒</span>
                  <span className="reroll-btn__label" style={{opacity:0.7}}>{label}</span>
                </button>
              );
        })}
        {/* Horizontal buttons in bottom row, columns 1-3 */}
        {([
          ['frame', 1],
          ['armour', 2],
          ['weapon', 3]
        ] as [string, number][]).map(([type, col], i) => {
          const key = `horizontal-btn-${type}-${col}`;
          const unlockedKey = type as keyof typeof unlocked;
          const label = (type as string).toUpperCase();
          return unlocked[unlockedKey]
            ? (
                <button
                  key={key}
                  className={`reroll-btn reroll-btn--${type} reroll-btn--horizontal`}
                  style={{ gridRow: 4, gridColumn: col, position:'relative', padding:'0' }}
                  onClick={() => onReroll(type as string)}
                >
                  <span className="coin-badge"><span className="coin-badge__bg" /><span className="coin-badge__amount">10</span></span>
                  <div className="reroll-btn__lock-flex" style={{display:'flex',justifyContent:'center',alignItems:'center',gap:8}}>
                    <RerollIcon size={18} color="#fff" />
                    <span className="reroll-btn__label">{label}</span>
                  </div>
                </button>
              )
            : lockedBtn(label, unlockedKey, { gridRow: 4, gridColumn: col, position:'relative', padding:'0' }, key);
        })}
        {/* Gold display in bottom right (row 4, col 4) */}
        <div
          className="shop-gold-display"
          style={{ 
            gridRow: 4, 
            gridColumn: 4, 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 700, 
            color: 'var(--color-gold)', 
            fontSize: '1.2em', 
            height: 64,
            width: 64,
            transition: 'background-color 0.2s',
            borderRadius: 6
          }}
          onDragOver={e => {
            if (e.dataTransfer.types.includes('application/json') || e.dataTransfer.types.includes('application/bot')) {
              e.preventDefault();
              e.currentTarget.setAttribute('data-dragging', 'true');
            }
          }}
          onDragLeave={e => {
            e.currentTarget.setAttribute('data-dragging', 'false');
          }}
          onDrop={e => {
            e.currentTarget.setAttribute('data-dragging', 'false');
            if (e.dataTransfer.types.includes('application/bot')) {
              const data = e.dataTransfer.getData('application/bot');
              if (!data) return;
              try {
                const { id, botWithParts } = JSON.parse(data);
                // Calculate total value of all parts
                let total = 0;
                botWithParts.slots.forEach((slot: any) => {
                  if (slot.part && slot.part.cost) {
                    total += slot.part.cost;
                  }
                });
                onSell({
                  id,
                  cost: total,
                  type: 'bot'
                });
                return;
              } catch {}
            }
            const data = e.dataTransfer.getData('application/json');
            if (!data) return;
            try {
              const item = JSON.parse(data);
              onSell(item);
            } catch {}
          }}
        >
          <span style={{display:'flex',alignItems:'center',gap:6}}>
            <CoinIcon size={20} stroke={2.5} />
            <span style={{color:'var(--color-gold)',fontWeight:700}}>{gold}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShopGrid;
