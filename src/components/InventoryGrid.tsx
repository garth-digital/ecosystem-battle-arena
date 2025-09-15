import React from 'react';
import { InventoryItem } from '../App';
import './shop.css';

interface InventoryGridProps {
  inventory: InventoryItem[];
  onDragStart?: (item: InventoryItem, e: React.DragEvent) => void;
}

const InventoryGrid: React.FC<InventoryGridProps> = ({ inventory, onDragStart }) => (
  <div className="inventory-section">
    <div className="inventory-grid">
      {inventory.length === 0 ? (
        <div className="inventory-empty">Inventory is empty</div>
      ) : (
        inventory.map(item => (
          <div
            key={item.id}
            className="inventory-slot"
            draggable
            onDragStart={e => onDragStart && onDragStart(item, e)}
          >
            <div className="inventory-item">
              <div className="inventory-item__name">{item.name}</div>
              <div className="inventory-item__type">{item.type}</div>
              <div className="inventory-item__rarity">{item.rarity}</div>
              <div className="inventory-item__cost">{item.cost}g</div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default InventoryGrid;
