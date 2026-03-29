'use client';

import { useState } from 'react';

export type BlockType = 'heading' | 'text' | 'pricing_table' | 'image' | 'divider' | 'signature';

export interface ProposalBlockData {
  id: string;
  type: BlockType;
  content: string;
  // Pricing table specific
  pricingItems?: PricingItem[];
}

export interface PricingItem {
  id: string;
  name: string;
  description: string;
  price: number;       // cents
  optional: boolean;
  selected: boolean;   // for client view
}

interface ProposalBlockProps {
  block: ProposalBlockData;
  isEditing: boolean;
  onChange: (block: ProposalBlockData) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

export default function ProposalBlock({ block, isEditing, onChange, onDelete, onMoveUp, onMoveDown }: ProposalBlockProps) {
  if (!isEditing) {
    return <ProposalBlockView block={block} />;
  }

  return (
    <div className="group relative">
      {/* Block controls */}
      <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onMoveUp(block.id)} className="text-muted hover:text-foreground text-xs p-1">▲</button>
        <button onClick={() => onMoveDown(block.id)} className="text-muted hover:text-foreground text-xs p-1">▼</button>
        <button onClick={() => onDelete(block.id)} className="text-muted hover:text-red-400 text-xs p-1">×</button>
      </div>

      {/* Block content based on type */}
      {block.type === 'heading' && (
        <input
          type="text"
          value={block.content}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          placeholder="Section heading..."
          className="w-full text-xl font-bold bg-transparent text-foreground focus:outline-none border-b border-transparent hover:border-border focus:border-accent/50 pb-1"
        />
      )}

      {block.type === 'text' && (
        <textarea
          value={block.content}
          onChange={(e) => onChange({ ...block, content: e.target.value })}
          placeholder="Write your content here..."
          rows={4}
          className="w-full bg-transparent text-foreground/80 text-sm leading-relaxed resize-none focus:outline-none border border-transparent hover:border-border focus:border-accent/50 rounded-lg p-2"
        />
      )}

      {block.type === 'pricing_table' && (
        <PricingTableEditor
          items={block.pricingItems ?? []}
          onChange={(items) => onChange({ ...block, pricingItems: items })}
        />
      )}

      {block.type === 'divider' && (
        <div className="border-t border-border my-4" />
      )}

      {block.type === 'signature' && (
        <div className="glow-card p-4 text-center text-sm text-muted">
          E-signature block — client will sign here
        </div>
      )}
    </div>
  );
}

function ProposalBlockView({ block }: { block: ProposalBlockData }) {
  switch (block.type) {
    case 'heading':
      return <h2 className="text-xl font-bold text-foreground mb-2">{block.content}</h2>;
    case 'text':
      return <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{block.content}</p>;
    case 'pricing_table':
      return <PricingTableView items={block.pricingItems ?? []} />;
    case 'divider':
      return <div className="border-t border-border my-4" />;
    case 'signature':
      return (
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
          <p className="text-sm text-muted mb-2">Click to sign</p>
          <div className="h-16 border-b border-foreground/30 w-48 mx-auto" />
        </div>
      );
    default:
      return null;
  }
}

function PricingTableEditor({ items, onChange }: { items: PricingItem[]; onChange: (items: PricingItem[]) => void }) {
  function addItem() {
    onChange([...items, {
      id: Math.random().toString(36).substring(2, 8),
      name: '',
      description: '',
      price: 0,
      optional: false,
      selected: true,
    }]);
  }

  function updateItem(id: string, updates: Partial<PricingItem>) {
    onChange(items.map((item) => item.id === id ? { ...item, ...updates } : item));
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  const total = items.filter((i) => i.selected).reduce((sum, i) => sum + i.price, 0);

  return (
    <div className="glow-card p-4 space-y-3">
      <div className="text-xs text-muted uppercase tracking-wider font-medium">Pricing</div>
      {items.map((item) => (
        <div key={item.id} className="flex gap-2 items-start">
          <div className="flex-1 space-y-1">
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(item.id, { name: e.target.value })}
              placeholder="Line item name"
              className="w-full px-2 py-1 bg-transparent border-b border-border text-sm text-foreground focus:outline-none focus:border-accent/50"
            />
            <input
              type="text"
              value={item.description}
              onChange={(e) => updateItem(item.id, { description: e.target.value })}
              placeholder="Description (optional)"
              className="w-full px-2 py-1 bg-transparent text-xs text-muted focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
              <input
                type="number"
                value={item.price / 100 || ''}
                onChange={(e) => updateItem(item.id, { price: Math.round(parseFloat(e.target.value || '0') * 100) })}
                className="w-24 pl-6 pr-2 py-1 bg-surface border border-border rounded text-sm text-foreground text-right focus:outline-none focus:ring-1 focus:ring-accent/50"
              />
            </div>
            <label className="flex items-center gap-1 text-xs text-muted">
              <input
                type="checkbox"
                checked={item.optional}
                onChange={(e) => updateItem(item.id, { optional: e.target.checked })}
                className="accent-accent"
              />
              Optional
            </label>
            <button onClick={() => removeItem(item.id)} className="text-muted hover:text-red-400 text-xs">×</button>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <button onClick={addItem} className="text-xs text-accent hover:text-accent-light font-medium">+ Add item</button>
        <span className="text-sm font-bold text-foreground">${(total / 100).toLocaleString()}</span>
      </div>
    </div>
  );
}

function PricingTableView({ items }: { items: PricingItem[] }) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(items.filter((i) => !i.optional || i.selected).map((i) => i.id))
  );

  const total = items.filter((i) => selected.has(i.id)).reduce((sum, i) => sum + i.price, 0);

  return (
    <div className="glow-card p-5 space-y-3">
      {items.map((item) => {
        const isSelected = selected.has(item.id);
        return (
          <div
            key={item.id}
            className={`flex items-center justify-between py-2 ${item.optional ? 'cursor-pointer' : ''}`}
            onClick={() => {
              if (!item.optional) return;
              const next = new Set(selected);
              if (isSelected) next.delete(item.id);
              else next.add(item.id);
              setSelected(next);
            }}
          >
            <div className="flex items-center gap-3">
              {item.optional && (
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  isSelected ? 'border-accent bg-accent' : 'border-border'
                }`}>
                  {isSelected && <span className="text-white text-xs">✓</span>}
                </div>
              )}
              <div>
                <p className={`text-sm font-medium ${isSelected ? 'text-foreground' : 'text-muted line-through'}`}>
                  {item.name}
                </p>
                {item.description && (
                  <p className="text-xs text-muted">{item.description}</p>
                )}
              </div>
            </div>
            <span className={`text-sm font-semibold ${isSelected ? 'text-foreground' : 'text-muted'}`}>
              ${(item.price / 100).toLocaleString()}
            </span>
          </div>
        );
      })}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-sm text-muted">Total</span>
        <span className="text-lg font-bold text-accent">${(total / 100).toLocaleString()}</span>
      </div>
    </div>
  );
}
