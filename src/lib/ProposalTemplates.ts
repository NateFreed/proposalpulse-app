import type { ProposalBlockData, PricingItem } from './ProposalBlock';

export interface ProposalTemplate {
  id: string;
  name: string;
  industry: string;
  icon: string;
  blocks: ProposalBlockData[];
}

function id(): string {
  return Math.random().toString(36).substring(2, 8);
}

function pricingItem(name: string, description: string, price: number, optional = false): PricingItem {
  return { id: id(), name, description, price, optional, selected: !optional };
}

export const TEMPLATES: ProposalTemplate[] = [
  {
    id: 'web-design',
    name: 'Website Design',
    industry: 'Web Design',
    icon: '🎨',
    blocks: [
      { id: id(), type: 'heading', content: 'Website Design Proposal' },
      { id: id(), type: 'text', content: 'Thank you for considering us for your website redesign. We\'re excited to help bring your vision to life with a modern, responsive, and conversion-optimized website.' },
      { id: id(), type: 'heading', content: 'Scope of Work' },
      { id: id(), type: 'text', content: '- Discovery & strategy session\n- Wireframe design (3 key pages)\n- Visual design (homepage + 2 inner pages)\n- Responsive development\n- Content integration\n- Launch & handover' },
      { id: id(), type: 'heading', content: 'Timeline' },
      { id: id(), type: 'text', content: 'Estimated completion: 6-8 weeks from project kickoff.\n\nWeek 1-2: Discovery & wireframes\nWeek 3-4: Visual design & revisions\nWeek 5-6: Development\nWeek 7-8: Testing & launch' },
      { id: id(), type: 'heading', content: 'Investment' },
      {
        id: id(), type: 'pricing_table', content: '',
        pricingItems: [
          pricingItem('Website Design & Development', '5-page responsive website', 500000),
          pricingItem('Content Writing', 'Professional copy for all pages', 150000, true),
          pricingItem('SEO Setup', 'On-page SEO optimization', 100000, true),
          pricingItem('Monthly Maintenance', '3 months of updates & support', 75000, true),
        ],
      },
      { id: id(), type: 'divider', content: '' },
      { id: id(), type: 'signature', content: '' },
    ],
  },
  {
    id: 'consulting',
    name: 'Consulting Engagement',
    industry: 'Consulting',
    icon: '💼',
    blocks: [
      { id: id(), type: 'heading', content: 'Consulting Proposal' },
      { id: id(), type: 'text', content: 'Based on our initial conversation, I\'ve outlined a consulting engagement to help you achieve your goals. This proposal covers scope, deliverables, timeline, and investment.' },
      { id: id(), type: 'heading', content: 'Objectives' },
      { id: id(), type: 'text', content: '1. Assess current processes and identify improvement areas\n2. Develop actionable recommendations\n3. Create implementation roadmap\n4. Provide ongoing advisory support' },
      { id: id(), type: 'heading', content: 'Deliverables' },
      { id: id(), type: 'text', content: '- Current state assessment report\n- Gap analysis document\n- Strategic recommendations deck\n- Implementation timeline\n- Monthly check-in calls (3 months)' },
      { id: id(), type: 'heading', content: 'Investment' },
      {
        id: id(), type: 'pricing_table', content: '',
        pricingItems: [
          pricingItem('Strategy Assessment', '2-week deep-dive analysis', 800000),
          pricingItem('Implementation Support', '4 weeks of hands-on guidance', 1200000, true),
          pricingItem('Monthly Advisory', '3 months of advisory calls', 450000, true),
        ],
      },
      { id: id(), type: 'divider', content: '' },
      { id: id(), type: 'signature', content: '' },
    ],
  },
  {
    id: 'photography',
    name: 'Photography Session',
    industry: 'Photography',
    icon: '📸',
    blocks: [
      { id: id(), type: 'heading', content: 'Photography Proposal' },
      { id: id(), type: 'text', content: 'I\'d love to capture your special moments. Here\'s what I have in mind for your session.' },
      { id: id(), type: 'heading', content: 'What\'s Included' },
      { id: id(), type: 'text', content: '- Pre-session consultation\n- 2-hour photography session\n- Professional editing of all selected images\n- Online gallery for viewing and downloading\n- Print release included' },
      { id: id(), type: 'heading', content: 'Packages' },
      {
        id: id(), type: 'pricing_table', content: '',
        pricingItems: [
          pricingItem('Standard Session', '2 hours, 30 edited images', 75000),
          pricingItem('Premium Editing', 'Advanced retouching on 10 hero shots', 25000, true),
          pricingItem('Photo Album', '20-page premium printed album', 35000, true),
          pricingItem('Extra Hour', 'Additional shooting time', 20000, true),
        ],
      },
      { id: id(), type: 'divider', content: '' },
      { id: id(), type: 'signature', content: '' },
    ],
  },
];

export function getTemplate(id: string): ProposalTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
