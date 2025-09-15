import React from 'react';

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
  common: '#bfcfff',
  rare: '#a259ff',
  mythic: '#ffe066',
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
    className={`shop-card${highlight ? ' shop-card--selected' : ''}${small ? ' shop-card--small' : ''}`}
    style={{ borderColor: rarityColors[rarity], cursor: onClick ? 'pointer' : undefined }}
    onClick={onClick}
    draggable={draggable}
    onDragStart={onDragStart}
    tabIndex={0}
    role="button"
  >
    <div className="shop-card__header">
      <span className="shop-card__type">{type}</span>
      <span className="shop-card__rarity" style={{ color: rarityColors[rarity] }}>{rarity}</span>
      <span className="shop-card__cost">
        <span className={`currency currency--${currency}`}></span> {cost}
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
    </div>
  </div>
);

export default ShopCard;
