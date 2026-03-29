'use client';

import Tutorial, { TutorialStep } from './Tutorial';

const steps: TutorialStep[] = [
  {
    title: 'AI-Powered Proposals',
    description: 'Describe your project and ProposalPulse will generate a professional proposal in seconds. Customize the tone, add pricing tables, and send it off.',
  },
  {
    title: 'Interactive Pricing',
    description: 'Add pricing tables with toggleable line items so clients can see exactly what they\'re paying for. Adjustments update totals in real-time.',
  },
  {
    title: 'Track & Close',
    description: 'Know exactly when clients open your proposal, how long they spend on each section, and when they\'re ready to sign. Built-in e-signatures make closing seamless.',
  },
];

export default function AppTutorial() {
  return <Tutorial appName="ProposalPulse" steps={steps} accentColor="bg-accent" />;
}
