'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProposalBlock from '@/components/ProposalBlock';
import TemplatePicker from '@/components/TemplatePicker';
import type { ProposalBlockData } from '@/components/ProposalBlock';
import { getTemplate } from '@/lib/ProposalTemplates';

function generateId(): string {
  return Math.random().toString(36).substring(2, 8);
}

const BLANK_BLOCKS: ProposalBlockData[] = [
  { id: generateId(), type: 'heading', content: 'Proposal Title' },
  { id: generateId(), type: 'text', content: '' },
  { id: generateId(), type: 'heading', content: 'Scope of Work' },
  { id: generateId(), type: 'text', content: '' },
  { id: generateId(), type: 'heading', content: 'Investment' },
  { id: generateId(), type: 'pricing_table', content: '', pricingItems: [] },
  { id: generateId(), type: 'divider', content: '' },
  { id: generateId(), type: 'signature', content: '' },
];

type BlockType = ProposalBlockData['type'];

const ADD_BLOCK_OPTIONS: { type: BlockType; label: string; icon: string }[] = [
  { type: 'heading', label: 'Heading', icon: 'H' },
  { type: 'text', label: 'Text', icon: '¶' },
  { type: 'pricing_table', label: 'Pricing', icon: '$' },
  { type: 'divider', label: 'Divider', icon: '—' },
  { type: 'signature', label: 'Signature', icon: '✍' },
];

export default function EditorPage() {
  const router = useRouter();
  const [blocks, setBlocks] = useState<ProposalBlockData[] | null>(null);
  const [proposalTitle, setProposalTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [showAddMenu, setShowAddMenu] = useState(false);

  const handleTemplateSelect = useCallback((templateId: string) => {
    const template = getTemplate(templateId);
    if (template) {
      setBlocks(template.blocks);
      setProposalTitle(template.blocks[0]?.content || template.name);
    }
  }, []);

  const handleBlank = useCallback(() => {
    setBlocks(BLANK_BLOCKS);
    setProposalTitle('New Proposal');
  }, []);

  const handleBlockChange = useCallback((updated: ProposalBlockData) => {
    setBlocks((prev) => prev?.map((b) => b.id === updated.id ? updated : b) ?? null);
  }, []);

  const handleBlockDelete = useCallback((id: string) => {
    setBlocks((prev) => prev?.filter((b) => b.id !== id) ?? null);
  }, []);

  const handleMoveUp = useCallback((id: string) => {
    setBlocks((prev) => {
      if (!prev) return null;
      const idx = prev.findIndex((b) => b.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }, []);

  const handleMoveDown = useCallback((id: string) => {
    setBlocks((prev) => {
      if (!prev) return null;
      const idx = prev.findIndex((b) => b.id === id);
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }, []);

  const handleAddBlock = useCallback((type: BlockType) => {
    const newBlock: ProposalBlockData = {
      id: generateId(),
      type,
      content: type === 'heading' ? 'New Section' : '',
      pricingItems: type === 'pricing_table' ? [] : undefined,
    };
    setBlocks((prev) => prev ? [...prev, newBlock] : [newBlock]);
    setShowAddMenu(false);
  }, []);

  const handleSend = useCallback(async () => {
    // TODO: Save to Supabase, generate share link, send email
    alert('Proposal saved! Share link would be generated here.');
  }, []);

  // Template picker
  if (!blocks) {
    return <TemplatePicker onSelect={handleTemplateSelect} onBlank={handleBlank} />;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.push('/dashboard')} className="text-sm text-muted hover:text-foreground transition-colors">
          ← Back
        </button>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-surface border border-border hover:border-border-light rounded-xl text-sm text-muted hover:text-foreground transition-colors">
            Preview
          </button>
          <button
            onClick={handleSend}
            className="px-5 py-2 bg-accent hover:bg-accent-light rounded-xl text-sm font-semibold text-white shadow-sm shadow-accent/10 transition-all"
          >
            Send Proposal
          </button>
        </div>
      </div>

      {/* Client info */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div>
          <label className="text-xs text-muted uppercase tracking-wider font-medium mb-1 block">Client Name</label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Client or company name"
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-foreground placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-muted uppercase tracking-wider font-medium mb-1 block">Client Email</label>
          <input
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            placeholder="client@company.com"
            className="w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-foreground placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
          />
        </div>
      </div>

      {/* Block editor */}
      <div className="space-y-4 pl-12">
        {blocks.map((block) => (
          <ProposalBlock
            key={block.id}
            block={block}
            isEditing={true}
            onChange={handleBlockChange}
            onDelete={handleBlockDelete}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
          />
        ))}
      </div>

      {/* Add block */}
      <div className="mt-6 pl-12 relative">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full py-3 border-2 border-dashed border-border hover:border-border-light rounded-xl text-sm text-muted hover:text-foreground transition-colors"
        >
          + Add Block
        </button>
        {showAddMenu && (
          <div className="absolute top-full left-0 mt-2 z-10 glow-card p-2 flex gap-1">
            {ADD_BLOCK_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                onClick={() => handleAddBlock(opt.type)}
                className="px-3 py-2 rounded-lg text-xs text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
              >
                <span className="font-mono mr-1">{opt.icon}</span> {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
