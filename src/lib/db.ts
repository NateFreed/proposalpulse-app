import { supabase } from './supabase';
import type { Proposal, ProposalView } from './types';

export async function getProposals(userId: string): Promise<Proposal[]> {
  const { data, error } = await supabase.from('pp_proposals').select('*').eq('user_id', userId).order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getProposal(proposalId: string): Promise<Proposal | null> {
  const { data, error } = await supabase.from('pp_proposals').select('*').eq('id', proposalId).single();
  if (error) return null;
  return data;
}

export async function getProposalByToken(token: string): Promise<Proposal | null> {
  const { data, error } = await supabase.from('pp_proposals').select('*').eq('share_token', token).single();
  if (error) return null;
  return data;
}

export async function createProposal(userId: string, title: string, clientName: string, clientEmail: string): Promise<Proposal> {
  const shareToken = Math.random().toString(36).substring(2, 10);
  const { data, error } = await supabase.from('pp_proposals').insert({ user_id: userId, title, client_name: clientName, client_email: clientEmail, blocks: [], status: 'draft', total_value: 0, share_token: shareToken }).select().single();
  if (error) throw error;
  return data;
}

export async function updateProposal(proposalId: string, updates: Partial<Proposal>): Promise<void> {
  await supabase.from('pp_proposals').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', proposalId);
}

export async function deleteProposal(proposalId: string): Promise<void> {
  await supabase.from('pp_proposals').delete().eq('id', proposalId);
}

export async function sendProposal(proposalId: string): Promise<void> {
  await supabase.from('pp_proposals').update({ status: 'sent', sent_at: new Date().toISOString() }).eq('id', proposalId);
}

export async function acceptProposal(token: string, signatureName: string): Promise<void> {
  await supabase.from('pp_proposals').update({ status: 'accepted', accepted_at: new Date().toISOString(), signature_name: signatureName, signature_date: new Date().toISOString() }).eq('share_token', token);
}

export async function declineProposal(token: string): Promise<void> {
  await supabase.from('pp_proposals').update({ status: 'declined' }).eq('share_token', token);
}

export async function trackView(proposalId: string, timeSpent: number, sectionsViewed: string[]): Promise<void> {
  await supabase.from('pp_proposal_views').insert({ proposal_id: proposalId, time_spent_seconds: timeSpent, sections_viewed: sectionsViewed });
  await supabase.from('pp_proposals').update({ status: 'viewed', viewed_at: new Date().toISOString() }).eq('id', proposalId).eq('status', 'sent');
}
