'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<'free' | 'pro'>('free');
  const [notifications, setNotifications] = useState({
    proposalViewed: true,
    proposalSigned: true,
    proposalExpiring: true,
    weeklyStats: false,
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
  }

  const inputClass = "w-full px-4 py-2.5 bg-surface border border-border rounded-xl text-foreground placeholder-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm";

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-8">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      {/* Business info */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Business</h2>
        <div className="glow-card p-5 space-y-3">
          <div>
            <label className="text-xs text-muted mb-1.5 block">Business Name</label>
            <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your business" className={inputClass} />
          </div>
          <div>
            <label className="text-xs text-muted mb-1.5 block">Contact Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@company.com" className={inputClass} />
          </div>
        </div>
      </section>

      {/* Branding */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Branding</h2>
        <div className="glow-card p-5 space-y-3">
          <div>
            <label className="text-xs text-muted mb-1.5 block">Default accent color</label>
            <div className="flex gap-2">
              {['#f43f5e', '#8b5cf6', '#0ea5e9', '#22c55e', '#f59e0b', '#ec4899'].map((color) => (
                <button key={color} className="w-8 h-8 rounded-lg border-2 border-transparent hover:border-foreground/30 transition-colors"
                  style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted mb-1.5 block">Default payment terms</label>
            <select className={inputClass} defaultValue="net30">
              <option value="due_on_receipt">Due on receipt</option>
              <option value="net15">Net 15</option>
              <option value="net30">Net 30</option>
              <option value="net60">Net 60</option>
            </select>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Notifications</h2>
        <div className="glow-card p-5 space-y-3">
          {[
            { key: 'proposalViewed' as const, label: 'Proposal viewed', desc: 'Alert when a client opens your proposal' },
            { key: 'proposalSigned' as const, label: 'Proposal signed', desc: 'Alert when a client signs and accepts' },
            { key: 'proposalExpiring' as const, label: 'Expiring proposals', desc: 'Reminder 3 days before a proposal expires' },
            { key: 'weeklyStats' as const, label: 'Weekly stats', desc: 'Win rate and revenue summary every Monday' },
          ].map((item) => (
            <label key={item.key} className="flex items-center justify-between cursor-pointer py-1">
              <div>
                <span className="text-sm text-foreground">{item.label}</span>
                <p className="text-xs text-muted">{item.desc}</p>
              </div>
              <div className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${notifications[item.key] ? 'bg-accent' : 'bg-border-light'}`}
                onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}>
                <div className={`w-4 h-4 rounded-full bg-white mt-0.5 transition-transform ${notifications[item.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Plan */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Subscription</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'free' as const, name: 'Free', price: '$0', features: '3 proposals/mo, basic templates' },
            { id: 'pro' as const, name: 'Pro', price: '$9/mo', features: 'Unlimited proposals, AI generation, analytics, e-signatures' },
          ].map((tier) => (
            <button key={tier.id} onClick={() => setPlan(tier.id)}
              className={`glow-card p-4 text-left transition-all ${plan === tier.id ? '!border-accent' : ''}`}>
              <h3 className="text-sm font-semibold text-foreground">{tier.name}</h3>
              <p className="text-lg font-bold text-accent mt-1">{tier.price}</p>
              <p className="text-xs text-muted mt-2">{tier.features}</p>
              {plan === tier.id && <span className="text-[10px] text-accent font-medium mt-2 block">Current plan</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Danger zone */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-danger">Danger Zone</h2>
        <div className="glow-card p-5 !border-danger/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-foreground">Delete account</h3>
              <p className="text-xs text-muted">Permanently remove all proposals, templates, and data</p>
            </div>
            <button className="px-4 py-2 bg-danger/15 text-danger rounded-xl text-xs font-medium hover:bg-danger/25 transition-colors">Delete</button>
          </div>
        </div>
      </section>

      <button onClick={handleSave} disabled={saving}
        className="w-full py-3 bg-accent hover:bg-accent-light disabled:opacity-50 rounded-xl font-semibold text-white shadow-lg shadow-accent/25 transition-all">
        {saving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}
