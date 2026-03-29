export interface Proposal {
  id: string;
  user_id: string;
  client_name: string;
  client_email: string;
  title: string;
  blocks: ProposalBlock[];
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined';
  total_value: number;
  share_token: string;
  signature_name: string | null;
  signature_date: string | null;
  sent_at: string | null;
  viewed_at: string | null;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProposalBlock {
  id: string;
  type: 'heading' | 'text' | 'pricing' | 'divider' | 'image' | 'signature';
  content: string;
  pricing_items?: PricingItem[];
}

export interface PricingItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  optional: boolean;
  selected: boolean;
}

export interface ProposalTemplate {
  id: string;
  name: string;
  industry: string;
  blocks: ProposalBlock[];
}

export interface ProposalView {
  id: string;
  proposal_id: string;
  viewed_at: string;
  time_spent_seconds: number;
  sections_viewed: string[];
}

export interface ProposalStats {
  totalProposals: number;
  sentProposals: number;
  acceptedProposals: number;
  acceptRate: number;
  totalValue: number;
  avgDealSize: number;
}
