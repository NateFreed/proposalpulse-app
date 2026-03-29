'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProposalBlock from '@/components/ProposalBlock';
import type { ProposalBlockData } from '@/components/ProposalBlock';
import { TEMPLATES } from '@/lib/ProposalTemplates';

function ClientViewContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [blocks, setBlocks] = useState<ProposalBlockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [sigName, setSigName] = useState('');
  const [proposalTitle, setProposalTitle] = useState('');
  const [fromName, setFromName] = useState('');

  useEffect(() => {
    // Mock: load from template for demo. Real: fetch from Supabase by token
    const template = TEMPLATES[0];
    if (template) {
      setBlocks(template.blocks);
      setProposalTitle(template.blocks[0]?.content || 'Proposal');
      setFromName('Design Studio');
    }
    setLoading(false);
  }, [token]);

  async function handleAccept() {
    if (!sigName.trim()) return;
    setAccepted(true);
    // TODO: Save signature to Supabase, update proposal status
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (accepted) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-2">Proposal Accepted!</h1>
        <p className="text-gray-400 max-w-md text-center">
          Thank you for accepting the proposal. {fromName} has been notified and will be in touch shortly.
        </p>
        <p className="text-xs text-gray-600 mt-4">
          Signed by {sigName} on {new Date().toLocaleDateString()}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Proposal from {fromName}</p>
          <h1 className="text-3xl font-bold">{proposalTitle}</h1>
        </div>

        {/* Proposal blocks (client view mode) */}
        <div className="space-y-6">
          {blocks.map((block) => (
            <ProposalBlock
              key={block.id}
              block={block}
              isEditing={false}
              onChange={() => {}}
              onDelete={() => {}}
              onMoveUp={() => {}}
              onMoveDown={() => {}}
            />
          ))}
        </div>

        {/* Accept/Decline section */}
        <div className="mt-12 glow-card p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">Ready to move forward?</h3>
          <div className="max-w-sm mx-auto space-y-3">
            <input
              type="text"
              value={sigName}
              onChange={(e) => setSigName(e.target.value)}
              placeholder="Type your full name to sign"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-sm text-center"
            />
            <div className="flex gap-3">
              <button
                onClick={handleAccept}
                disabled={!sigName.trim()}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl font-semibold text-white transition-colors"
              >
                Accept Proposal
              </button>
              <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm text-gray-400 transition-colors">
                Decline
              </button>
            </div>
            <p className="text-xs text-gray-600">
              By accepting, you agree to the terms outlined in this proposal.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <a href="/" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
            Powered by ProposalPulse
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ViewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    }>
      <ClientViewContent />
    </Suspense>
  );
}
