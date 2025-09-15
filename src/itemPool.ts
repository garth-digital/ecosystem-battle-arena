// Central pool of all possible shop items for reroll logic
import { ShopCardProps } from './components/ShopCard';

export const ITEM_POOL: ShopCardProps[] = [
  // Frames
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
  // Weapons
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
