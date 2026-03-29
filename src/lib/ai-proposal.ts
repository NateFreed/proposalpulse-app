import { supabase } from './supabase';
import type { ProposalBlock, PricingItem } from './types';

/**
 * AI Proposal Generator — the killer feature.
 * Describe the project → Claude generates a complete professional proposal.
 */
export async function generateProposal(
  projectBrief: string,
  clientName: string,
  industry: string
): Promise<{ title: string; blocks: ProposalBlock[] }> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-proposal', {
      body: { brief: projectBrief, client_name: clientName, industry },
    });

    if (!error && data?.blocks) {
      return { title: data.title, blocks: data.blocks };
    }
    return fallbackProposal(projectBrief, clientName, industry);
  } catch {
    return fallbackProposal(projectBrief, clientName, industry);
  }
}

function fallbackProposal(brief: string, clientName: string, industry: string): { title: string; blocks: ProposalBlock[] } {
  const title = `Proposal for ${clientName}`;
  const blocks: ProposalBlock[] = [
    { id: crypto.randomUUID(), type: 'heading', content: title },
    { id: crypto.randomUUID(), type: 'text', content: `Dear ${clientName},\n\nThank you for considering us for this project. Based on our conversation, here's our proposal for the work described:\n\n${brief}\n\nWe're excited about this opportunity and confident we can deliver exceptional results.` },
    { id: crypto.randomUUID(), type: 'heading', content: 'Scope of Work' },
    { id: crypto.randomUUID(), type: 'text', content: 'The following deliverables are included in this proposal. Optional items can be toggled on or off to customize the project to your needs.' },
    { id: crypto.randomUUID(), type: 'pricing', content: 'Project Pricing', pricing_items: generatePricingItems(industry) },
    { id: crypto.randomUUID(), type: 'heading', content: 'Timeline' },
    { id: crypto.randomUUID(), type: 'text', content: 'We estimate this project will take 4-6 weeks from kickoff to final delivery. Key milestones will be shared within the first week.' },
    { id: crypto.randomUUID(), type: 'divider', content: '' },
    { id: crypto.randomUUID(), type: 'heading', content: 'Next Steps' },
    { id: crypto.randomUUID(), type: 'text', content: 'If this proposal looks good, simply click "Accept" below to get started. We\'ll follow up within 24 hours to schedule the kickoff call.' },
    { id: crypto.randomUUID(), type: 'signature', content: 'Accept & Sign' },
  ];
  return { title, blocks };
}

function generatePricingItems(industry: string): PricingItem[] {
  const templates: Record<string, PricingItem[]> = {
    'web-design': [
      { id: crypto.randomUUID(), description: 'Website Design & Development', quantity: 1, unit_price: 3500, optional: false, selected: true },
      { id: crypto.randomUUID(), description: 'Responsive Mobile Optimization', quantity: 1, unit_price: 800, optional: false, selected: true },
      { id: crypto.randomUUID(), description: 'SEO Setup & Optimization', quantity: 1, unit_price: 500, optional: true, selected: true },
      { id: crypto.randomUUID(), description: 'Content Writing (per page)', quantity: 5, unit_price: 150, optional: true, selected: false },
    ],
    'consulting': [
      { id: crypto.randomUUID(), description: 'Strategy Workshop (half-day)', quantity: 1, unit_price: 2000, optional: false, selected: true },
      { id: crypto.randomUUID(), description: 'Implementation Support (per hour)', quantity: 20, unit_price: 150, optional: false, selected: true },
      { id: crypto.randomUUID(), description: 'Follow-up Sessions', quantity: 4, unit_price: 300, optional: true, selected: true },
    ],
    default: [
      { id: crypto.randomUUID(), description: 'Core Project Deliverable', quantity: 1, unit_price: 2500, optional: false, selected: true },
      { id: crypto.randomUUID(), description: 'Additional Revisions', quantity: 3, unit_price: 200, optional: true, selected: true },
      { id: crypto.randomUUID(), description: 'Priority Support', quantity: 1, unit_price: 500, optional: true, selected: false },
    ],
  };
  return templates[industry] || templates.default;
}
