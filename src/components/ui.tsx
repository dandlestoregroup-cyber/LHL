import React from 'react';
import { ArrowRight, DatabaseZap, Inbox, ShieldCheck } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi } from '../lib/display';

export function PageHeader({ eyebrow, eyebrowAr, title, titleAr, description, descriptionAr, action }: {
  eyebrow: string; eyebrowAr: string; title: string; titleAr: string; description: string; descriptionAr: string; action?: React.ReactNode;
}) {
  const { lang } = useOperating();
  return (
    <div className="page-shell pt-12 md:pt-16">
      <div className="flex flex-col gap-6 border-b border-clay-200 pb-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <span className="eyebrow">{bi(lang, eyebrow, eyebrowAr)}</span>
          <h1 className="display-title mt-3">{bi(lang, title, titleAr)}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-600">{bi(lang, description, descriptionAr)}</p>
        </div>
        {action}
      </div>
    </div>
  );
}

export function Metric({ label, labelAr, value, detail, detailAr, tone = 'paper' }: {
  label: string; labelAr: string; value: React.ReactNode; detail?: string; detailAr?: string; tone?: 'paper' | 'terracotta' | 'ink';
}) {
  const { lang } = useOperating();
  return (
    <div className={`metric metric-${tone}`}>
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-65">{bi(lang, label, labelAr)}</span>
      <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
      {detail && <p className="mt-2 text-xs leading-5 opacity-70">{bi(lang, detail, detailAr || detail)}</p>}
    </div>
  );
}

export function EmptyState({ title, titleAr, description, descriptionAr, actionLabel, actionLabelAr, onAction, icon = 'inbox' }: {
  title: string; titleAr: string; description: string; descriptionAr: string; actionLabel?: string; actionLabelAr?: string; onAction?: () => void; icon?: 'inbox' | 'data';
}) {
  const { lang, mode } = useOperating();
  const Icon = icon === 'data' ? DatabaseZap : Inbox;
  return (
    <div className="empty-state">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-clay-100 text-terracotta-700"><Icon size={21} /></div>
      <span className={`mode-chip mt-5 ${mode === 'demo' ? 'mode-chip-demo' : 'mode-chip-live'}`}>{mode.toUpperCase()}</span>
      <h2 className="mt-4 font-serif text-3xl text-ink-900">{bi(lang, title, titleAr)}</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-ink-600">{bi(lang, description, descriptionAr)}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="button-primary mt-6">
          {bi(lang, actionLabel, actionLabelAr || actionLabel)} <ArrowRight size={15} className="rtl:rotate-180" />
        </button>
      )}
    </div>
  );
}

export function StatusPill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'good' | 'warn' | 'bad' | 'demo' }) {
  return <span className={`status-pill status-${tone}`}>{children}</span>;
}

export function DemoRecordMark() {
  const { mode, lang } = useOperating();
  if (mode !== 'demo') return null;
  return <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.16em] text-terracotta-700"><ShieldCheck size={11} />{bi(lang, 'Synthetic demo', 'بيانات تجريبية')}</span>;
}
