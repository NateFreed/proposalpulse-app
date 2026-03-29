'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUser } from '@/lib/auth';
import AppTutorial from '@/components/AppTutorial';

// Mock data for v1
const MOCK_PROPOSALS = [
  { id: '1', title: 'Website Redesign — Acme Corp', client_name: 'Sarah Johnson', status: 'accepted' as const, total_value: 650000, sent_at: '2026-03-25T10:00:00Z' },
  { id: '2', title: 'Brand Strategy — TechStart', client_name: 'Mike Chen', status: 'viewed' as const, total_value: 1200000, sent_at: '2026-03-26T14:00:00Z' },
  { id: '3', title: 'Photography Package — Green Events', client_name: 'Lisa Park', status: 'sent' as const, total_value: 95000, sent_at: '2026-03-27T09:00:00Z' },
  { id: '4', title: 'Mobile App Prototype', client_name: 'David Brown', status: 'draft' as const, total_value: 2500000, sent_at: null },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: 'bg-muted/15', text: 'text-muted', label: 'Draft' },
  sent: { bg: 'bg-accent/15', text: 'text-accent', label: 'Sent' },
  viewed: { bg: 'bg-blue-400/15', text: 'text-blue-400', label: 'Viewed' },
  accepted: { bg: 'bg-success/15', text: 'text-success', label: 'Accepted' },
  declined: { bg: 'bg-danger/15', text: 'text-danger', label: 'Declined' },
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try { await getUser(); } catch {} finally { setLoading(false); }
    }
    init();
  }, []);

  const totalValue = MOCK_PROPOSALS.reduce((sum, p) => sum + p.total_value, 0);
  const accepted = MOCK_PROPOSALS.filter((p) => p.status === 'accepted');
  const acceptedValue = accepted.reduce((sum, p) => sum + p.total_value, 0);
  const acceptRate = MOCK_PROPOSALS.filter((p) => p.status !== 'draft').length > 0
    ? Math.round((accepted.length / MOCK_PROPOSALS.filter((p) => p.status !== 'draft').length) * 100)
    : 0;

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <AppTutorial />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Proposals</h1>
        <div className="flex items-center gap-2">
          <Link href="/settings" className="px-4 py-2 bg-surface border border-border rounded-xl text-sm text-muted hover:text-foreground transition-colors">
            Settings
          </Link>
          <Link href="/editor" className="px-4 py-2 bg-accent hover:bg-accent-light rounded-xl text-sm font-semibold text-white shadow-sm shadow-accent/10 transition-all">
            + New Proposal
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glow-card p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{MOCK_PROPOSALS.length}</div>
          <div className="text-xs text-muted">Total</div>
        </div>
        <div className="glow-card p-4 text-center">
          <div className="text-2xl font-bold text-accent">${(totalValue / 100).toLocaleString()}</div>
          <div className="text-xs text-muted">Pipeline</div>
        </div>
        <div className="glow-card p-4 text-center">
          <div className="text-2xl font-bold text-success">${(acceptedValue / 100).toLocaleString()}</div>
          <div className="text-xs text-muted">Won</div>
        </div>
        <div className="glow-card p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{acceptRate}%</div>
          <div className="text-xs text-muted">Accept Rate</div>
        </div>
      </div>

      {/* Proposal list */}
      <div className="space-y-2">
        {MOCK_PROPOSALS.map((proposal) => {
          const style = STATUS_STYLES[proposal.status];
          return (
            <Link key={proposal.id} href={`/editor?id=${proposal.id}`} className="glow-card p-4 flex items-center gap-4 hover:border-border-light transition-all block">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">{proposal.title}</h3>
                <p className="text-xs text-muted">{proposal.client_name}</p>
              </div>
              <span className="text-sm font-bold text-foreground">${(proposal.total_value / 100).toLocaleString()}</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                {style.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Cross-sell: InvoicePulse */}
      {accepted.length > 0 && (
        <div className="glow-card p-5 flex items-center justify-between !border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500/15 rounded-lg flex items-center justify-center text-emerald-400 text-sm">💰</div>
            <div>
              <h3 className="text-sm font-medium text-foreground">Proposal accepted? Create an invoice</h3>
              <p className="text-xs text-muted">{accepted.length} accepted proposal{accepted.length > 1 ? 's' : ''} ready to invoice — ${(acceptedValue / 100).toLocaleString()} total</p>
            </div>
          </div>
          <a href="https://invoicepulse.pages.dev/editor" target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-500/15 text-emerald-400 rounded-xl text-xs font-medium hover:bg-emerald-500/25 transition-colors flex-shrink-0">
            Create Invoice →
          </a>
        </div>
      )}
    </div>
  );
}
