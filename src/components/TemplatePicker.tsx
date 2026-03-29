'use client';

import { TEMPLATES } from '@/lib/ProposalTemplates';

interface TemplatePickerProps {
  onSelect: (templateId: string) => void;
  onBlank: () => void;
}

export default function TemplatePicker({ onSelect, onBlank }: TemplatePickerProps) {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Create a Proposal</h1>
        <p className="text-sm text-muted">Choose a template or start from scratch</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className="glow-card p-5 text-left hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            <span className="text-2xl mb-2 block">{template.icon}</span>
            <h3 className="text-sm font-semibold text-foreground mb-1">{template.name}</h3>
            <p className="text-xs text-muted">{template.industry}</p>
            <p className="text-xs text-muted/60 mt-2">{template.blocks.length} sections</p>
          </button>
        ))}
      </div>

      <button
        onClick={onBlank}
        className="w-full py-4 border-2 border-dashed border-border hover:border-border-light rounded-xl text-sm text-muted hover:text-foreground transition-colors"
      >
        Start from blank
      </button>

      <div className="text-center mt-6">
        <p className="text-xs text-muted/40">Or describe your project and let AI generate a proposal</p>
        <button className="mt-2 text-xs text-accent hover:text-accent-light font-medium transition-colors">
          ✨ Generate with AI →
        </button>
      </div>
    </div>
  );
}
