import { supabase } from './supabase';
import type { Proposal, ProposalView, ProposalStats } from './types';

export interface ProposalAnalytics {
  stats: ProposalStats;
  conversionFunnel: { stage: string; count: number }[];
  viewInsights: { proposalTitle: string; totalViews: number; avgTimeSeconds: number; status: string }[];
  monthlyRevenue: { month: string; accepted: number; value: number }[];
}

export async function fetchProposalAnalytics(userId: string): Promise<ProposalAnalytics> {
  const { data: proposals } = await supabase
    .from('pp_proposals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const allProposals: Proposal[] = proposals || [];

  const stats = computeStats(allProposals);
  const conversionFunnel = computeFunnel(allProposals);
  const viewInsights = await computeViewInsights(allProposals);
  const monthlyRevenue = computeMonthlyRevenue(allProposals);

  return { stats, conversionFunnel, viewInsights, monthlyRevenue };
}

function computeStats(proposals: Proposal[]): ProposalStats {
  const sent = proposals.filter(p => p.status !== 'draft');
  const accepted = proposals.filter(p => p.status === 'accepted');
  const totalValue = accepted.reduce((s, p) => s + p.total_value, 0);

  return {
    totalProposals: proposals.length,
    sentProposals: sent.length,
    acceptedProposals: accepted.length,
    acceptRate: sent.length > 0 ? Math.round((accepted.length / sent.length) * 100) : 0,
    totalValue,
    avgDealSize: accepted.length > 0 ? Math.round(totalValue / accepted.length) : 0,
  };
}

function computeFunnel(proposals: Proposal[]): { stage: string; count: number }[] {
  return [
    { stage: 'Created', count: proposals.length },
    { stage: 'Sent', count: proposals.filter(p => p.status !== 'draft').length },
    { stage: 'Viewed', count: proposals.filter(p => ['viewed', 'accepted', 'declined'].includes(p.status)).length },
    { stage: 'Accepted', count: proposals.filter(p => p.status === 'accepted').length },
  ];
}

async function computeViewInsights(proposals: Proposal[]): Promise<{ proposalTitle: string; totalViews: number; avgTimeSeconds: number; status: string }[]> {
  const insights = [];
  for (const p of proposals.slice(0, 10)) {
    const { data: views } = await supabase
      .from('pp_proposal_views')
      .select('*')
      .eq('proposal_id', p.id);

    const viewList: ProposalView[] = views || [];
    const totalViews = viewList.length;
    const avgTime = totalViews > 0
      ? Math.round(viewList.reduce((s, v) => s + v.time_spent_seconds, 0) / totalViews)
      : 0;

    insights.push({ proposalTitle: p.title, totalViews, avgTimeSeconds: avgTime, status: p.status });
  }
  return insights;
}

function computeMonthlyRevenue(proposals: Proposal[]): { month: string; accepted: number; value: number }[] {
  const byMonth = new Map<string, { accepted: number; value: number }>();
  for (const p of proposals.filter(p => p.status === 'accepted' && p.accepted_at)) {
    const month = p.accepted_at!.slice(0, 7);
    const existing = byMonth.get(month) || { accepted: 0, value: 0 };
    existing.accepted++;
    existing.value += p.total_value;
    byMonth.set(month, existing);
  }
  return Array.from(byMonth.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month));
}
