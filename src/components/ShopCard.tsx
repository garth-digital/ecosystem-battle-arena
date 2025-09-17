import React from 'react';
import './colors.css';

export type ShopCardProps = {
  id?: string;
  name: string;
  description: string;
  rarity: 'common' | 'rare' | 'mythic';
  type: string;
  cost: number;
  currency: 'gold' | 'crystal' | 'heart';
  stats: Array<{ label: string; value: string | number }>;
  size?: 'SML' | 'LAR';
  imageUrl?: string;
  highlight?: boolean;
  onClick?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  small?: boolean;
};


const rarityColors = {
  common: 'var(--color-border-common)',
  rare: 'var(--color-border-rare)',
  mythic: 'var(--color-border-mythic)',
};


export const ShopCard: React.FC<ShopCardProps> = ({
  name,
  description,
  rarity,
  type,
  cost,
  currency,
  stats,
  size,
  imageUrl,
  highlight,
  onClick,
  draggable,
  onDragStart,
  small,
}) => (
  <div
    className={`shop-card shop-card--universal${highlight ? ' shop-card--selected' : ''}${small ? ' shop-card--small' : ''} shop-card--${rarity}`}
    style={{
      borderColor: rarityColors[rarity],
      cursor: onClick ? 'pointer' : undefined,
      background:
        type === 'weapon' ? 'var(--color-weapon)' :
        type === 'armour' ? 'var(--color-armor)' :
        type === 'ecotech' ? 'var(--color-ecotech)' :
        type === 'frame' ? 'var(--color-bot)' :
        'var(--color-common)',
      color: rarity === 'common' ? '#232323' : '#fff',
      aspectRatio: '1/1',
      minWidth: small ? '56px' : '180px',
      minHeight: small ? '56px' : '180px',
      maxWidth: small ? '56px' : '180px',
      maxHeight: small ? '56px' : '180px',
      boxSizing: 'border-box',
      overflow: 'hidden',
    }}
    onClick={onClick}
    draggable={draggable}
    onDragStart={onDragStart}
    tabIndex={0}
    role="button"
  >
    <div className="shop-card__header">
      <span className="shop-card__type-label inventory-type-label" style={{
        background:
          type === 'weapon' ? 'var(--color-weapon)' :
          type === 'armour' ? 'var(--color-armor)' :
          type === 'ecotech' ? 'var(--color-ecotech)' :
          type === 'frame' ? 'var(--color-bot)' :
          'var(--color-common)',
        color: type === 'frame' ? '#fff' : '#232323',
      }}>{type}</span>
      <span className="shop-card__rarity" style={{ color: rarityColors[rarity] }}>{rarity}</span>
      <span className="shop-card__cost">
        <span className="gold-icon" role="img" aria-label="gold" style={{color:'var(--color-gold)',fontWeight:700}}>●</span> {cost}
      </span>
    </div>
    <div className="shop-card__image">
      {imageUrl ? <img src={imageUrl} alt={name} /> : <div className="shop-card__placeholder" />}
    </div>
    <div className="shop-card__body">
      <div className="shop-card__name">{name}</div>
      <div className="shop-card__desc">{description}</div>
      <div className="shop-card__stats">
        {stats.map((stat, i) => (
          <div key={i} className="shop-card__stat">
            <span className="shop-card__stat-label">{stat.label}</span>
            <span className="shop-card__stat-value">{stat.value}</span>
          </div>
        ))}
      </div>
      {size && <div className="shop-card__size">{size}</div>}
      <div className="shop-card__weight-box">
        <span role="img" aria-label="weight" style={{fontSize:'1em',verticalAlign:'middle'}}>⚖️</span> {stats.find(s => s.label === 'WT')?.value ?? 0}
      </div>
    </div>
  </div>
);

export default ShopCard;
