import React, { useState } from 'react';
import ShopGrid from './components/ShopGrid';
import { ITEM_POOL } from './itemPool';
import ShopCard, { ShopCardProps } from './components/ShopCard';
import PlayerInfoBar from './components/PlayerInfoBar';
import ArenaCanvas from './components/ArenaCanvas';
import BotArea from './components/BotArea';
import InventoryGrid from './components/InventoryGrid';
import './components/shop.css';
import './App.css';

// ...removed duplicate InventoryItem type...
export type InventoryItem = {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'mythic';
  type: 'frame' | 'weapon' | 'armour' | 'ecotech';
  cost: number;
  currency: string;
  stats: Array<{ label: string; value: string | number }>;
  size?: string;
  highlight?: boolean;
};

const App: React.FC = () => {
  const SHOP_SIZE = 9;
  const UNLOCK_COST = 10;
  const REROLL_COST = 5;
  const REROLL_TYPE_COST = 10;
  const initialInventory: InventoryItem[] = [];
  // Example starter bots
  const initialBots: any[] = [
    {
      id: 'bot-1',
      name: 'Bot 1',
      frame: ITEM_POOL.find(i => i.type === 'frame' && i.rarity === 'common'),
      weapon: ITEM_POOL.find(i => i.type === 'weapon' && i.rarity === 'common'),
      armour: ITEM_POOL.find(i => i.type === 'armour' && i.rarity === 'common'),
      ecotech: undefined
    },
    {
      id: 'bot-2',
      name: 'Bot 2',
      frame: ITEM_POOL.find(i => i.type === 'frame' && i.rarity === 'mythic'),
      weapon: undefined,
      armour: undefined,
      ecotech: undefined
    }
  ];

  const [gold, setGold] = useState(200);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [bots, setBots] = useState<any[]>(initialBots);
  type ShopGridItem = ShopCardProps | { blank: true };
  function getRandomShopItems(pool: ShopCardProps[], n: number): ShopCardProps[] {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n).map(item => ({
      ...item,
      id: `${item.name}-${item.rarity}-${item.type}`
    }));
  }
  const [shopItems, setShopItems] = useState<ShopGridItem[]>(() => getRandomShopItems(ITEM_POOL as ShopCardProps[], SHOP_SIZE));
  const [unlocked, setUnlocked] = useState<{ frame: boolean; armour: boolean; weapon: boolean; rare: boolean; mythic: boolean; }>({ frame: false, armour: false, weapon: false, rare: false, mythic: false });

  // Player info bar state
  const [round, setRound] = useState(1);
  const [health, setHealth] = useState(100);
  const [armor, setArmor] = useState(50);
  const [view, setView] = useState<'shop' | 'arena'>('shop');

  // Handler implementations
  const handlePurchase = (item: any, cost: number) => {
    if (gold >= cost) {
      setGold(gold - cost);
      setInventory([...inventory, item]);
      setShopItems(shopItems => shopItems.map(s => ('blank' in s ? s : s.id === item.id ? { blank: true } : s)));
    } else {
      alert('Not enough gold!');
    }
  };

  type UnlockType = 'frame' | 'armour' | 'weapon' | 'rare' | 'mythic';
  const handleUnlock = (type: UnlockType) => {
    if (gold < UNLOCK_COST) {
      alert('Not enough gold!');
      return;
    }
    setGold(g => g - UNLOCK_COST);
    setUnlocked(u => ({ ...u, [type]: true }));
  };

  const handleReroll = (type: UnlockType | string) => {
    let pool = ITEM_POOL;
    let cost = REROLL_COST;
    if (['frame', 'weapon', 'armour'].includes(type)) {
      const t = type as UnlockType;
      if (!unlocked[t]) {
        if (gold < UNLOCK_COST) {
          alert('Not enough gold!');
          return;
        }
        setGold(g => g - UNLOCK_COST);
        setUnlocked(u => ({ ...u, [t]: true }));
        return;
      }
      pool = ITEM_POOL.filter(i => i.type === type);
      cost = REROLL_TYPE_COST;
    } else if (['common', 'rare', 'mythic'].includes(type)) {
      pool = ITEM_POOL.filter(i => i.rarity === type);
      cost = REROLL_TYPE_COST;
    }
    if (gold < cost) {
      alert('Not enough gold!');
      return;
    }
    setGold(g => g - cost);
    setShopItems(getRandomShopItems(pool as ShopCardProps[], SHOP_SIZE));
  };

  const handleDropOnBot = (botIdx: number, slot: 'frame' | 'weapon' | 'ecotech' | 'armour', e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('application/json');
    if (!data) return;
    const item: InventoryItem = JSON.parse(data);
    if (slot !== item.type) {
      alert(`This part must go in the ${item.type} slot!`);
      return;
    }
    setInventory(inv => inv.filter(i => i.id !== item.id));
    setBots(prev => prev.map((bot, i) => {
      if (i !== botIdx) return bot;
      return { ...bot, [slot]: item };
    }));
  };

  return (
    <>
      <PlayerInfoBar round={round} health={health} armor={armor} view={view} setView={setView} />
      {view === 'arena' && <ArenaCanvas bots={bots} />}
      {view === 'shop' && (
        <ShopGrid
          shopItems={shopItems}
          onPurchase={handlePurchase}
          onReroll={handleReroll}
          gold={gold}
          unlocked={unlocked}
          onUnlock={handleUnlock}
          onSell={(item) => {
            setInventory(inv => inv.filter(i => i.id !== item.id));
            setGold(g => g + (item.cost || 1));
          }}
          onSellBot={(botIdx) => {
            setBots(prev => {
              const bot = prev[botIdx];
              if (!bot) return prev;
              let total = 0;
              ['frame', 'weapon', 'armour', 'ecotech'].forEach(slot => {
                if (bot[slot] && bot[slot].cost) total += bot[slot].cost;
              });
              setGold(g => g + total);
              return prev.filter((_, i) => i !== botIdx);
            });
          }}
        />
      )}
      <BotArea bots={bots} handleDropOnBot={handleDropOnBot} setBots={setBots} setInventory={setInventory} />
      <InventoryGrid
        inventory={inventory}
        onDragStart={(item, e) => {
          e.dataTransfer.setData('application/json', JSON.stringify(item));
        }}
      />
    </>
  );

// ...existing code...

                  return (
                    <>
                      <PlayerInfoBar round={round} health={health} armor={armor} view={view} setView={setView} />
                      {view === 'arena' && <ArenaCanvas bots={bots} />}
                      {view === 'shop' && (
                        <ShopGrid
                          shopItems={shopItems}
                          onPurchase={handlePurchase}
                          onReroll={handleReroll}
                          gold={gold}
                          unlocked={unlocked}
                          onUnlock={handleUnlock}
                          onSell={(item) => {
                            setInventory(inv => inv.filter(i => i.id !== item.id));
                            setGold(g => g + (item.cost || 1));
                          }}
                          onSellBot={(botIdx) => {
                            setBots(prev => {
                              const bot = prev[botIdx];
                              if (!bot) return prev;
                              let total = 0;
                              ['frame', 'weapon', 'armour', 'ecotech'].forEach(slot => {
                                if (bot[slot] && bot[slot].cost) total += bot[slot].cost;
                              });
                              setGold(g => g + total);
                              return prev.filter((_, i) => i !== botIdx);
                            });
                          }}
                        />
                      )}
                      <BotArea bots={bots} handleDropOnBot={handleDropOnBot} setBots={setBots} setInventory={setInventory} />
                    </>
                  );
}

export default App;
