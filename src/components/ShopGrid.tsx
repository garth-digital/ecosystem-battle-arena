
import React from 'react';
import ShopCard, { ShopCardProps } from './ShopCard';
import { InventoryItem } from '../App';

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
  onSell: (item: InventoryItem) => void;
  onSellBot: (botIdx: number) => void;
};

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


const ShopGrid: React.FC<ShopGridProps> = ({ onPurchase, shopItems, gold, unlocked, onUnlock, onReroll, onSell, onSellBot }) => {
  // Helper to render a locked reroll button
  const lockedBtn = (label: string, key: keyof typeof unlocked, style: React.CSSProperties) => (
    <button className="reroll-btn reroll-btn--locked" style={style} onClick={() => onUnlock(key)}>
      <span role="img" aria-label="locked">🔒</span><br/>
      Unlock<br/>10g
    </button>
  );

  return (
    <div className="shop-grid-wrapper">
      <div className="shop-grid">
        {shopItems.map((item, idx) => (
          <div className="shop-grid__cell" key={idx}>
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
        ))}
        {/* 3 vertical reroll buttons (right of grid) */}
        {unlocked.mythic
          ? <button className="reroll-btn reroll-btn--mythic" style={{ gridRow: 1, gridColumn: 4 }} onClick={() => onReroll('mythic')}>Mythic<br/>10g</button>
          : lockedBtn('Mythic', 'mythic', { gridRow: 1, gridColumn: 4 })}
        {unlocked.rare
          ? <button className="reroll-btn reroll-btn--rare" style={{ gridRow: 2, gridColumn: 4 }} onClick={() => onReroll('rare')}>Rare<br/>10g</button>
          : lockedBtn('Rare', 'rare', { gridRow: 2, gridColumn: 4 })}
        {/* Common is now reroll all */}
        <button className="reroll-btn reroll-btn--common" style={{ gridRow: 3, gridColumn: 4 }} onClick={() => onReroll('all')}>Reroll All<br/>5g</button>
        {/* 3 horizontal reroll buttons (below grid) */}
        {unlocked.frame
          ? <button className="reroll-btn reroll-btn--frame" style={{ gridRow: 4, gridColumn: 1 }} onClick={() => onReroll('frame')}>Frame<br/>10g</button>
          : lockedBtn('Frame', 'frame', { gridRow: 4, gridColumn: 1 })}
        {unlocked.armour
          ? <button className="reroll-btn reroll-btn--armor" style={{ gridRow: 4, gridColumn: 2 }} onClick={() => onReroll('armour')}>Armour<br/>10g</button>
          : lockedBtn('Armour', 'armour', { gridRow: 4, gridColumn: 2 })}
        {unlocked.weapon
          ? <button className="reroll-btn reroll-btn--weapon" style={{ gridRow: 4, gridColumn: 3 }} onClick={() => onReroll('weapon')}>Weapon<br/>10g</button>
          : lockedBtn('Weapon', 'weapon', { gridRow: 4, gridColumn: 3 })}
        {/* Gold display in bottom right */}
        <div
          className="shop-gold-display"
          style={{ gridRow: 4, gridColumn: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#ffe066', fontSize: '1.2em' }}
          onDragOver={e => {
            if (e.dataTransfer.types.includes('application/json') || e.dataTransfer.types.includes('application/bot')) {
              e.preventDefault();
            }
          }}
          onDrop={e => {
            if (e.dataTransfer.types.includes('application/bot')) {
              const data = e.dataTransfer.getData('application/bot');
              if (!data) return;
              const { botIdx } = JSON.parse(data);
              onSellBot(botIdx);
              return;
            }
            const data = e.dataTransfer.getData('application/json');
            if (!data) return;
            try {
              const item = JSON.parse(data);
              onSell(item);
            } catch {}
          }}
        >
          <span>Gold</span>
          <span>{gold}</span>
        </div>
      </div>
    </div>
  );
};

export default ShopGrid;
