import React from 'react';

export function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="glass-card p-6 bg-white dark:bg-[#0f1c2e] dark:border-[#1e3448] space-y-2">
      <div className="flex items-center gap-2 text-brand-muted dark:text-[#5a7a96] text-[10px] font-bold uppercase tracking-widest">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-bold font-serif text-brand-ink dark:text-[#e0eaf4] italic">{value}</div>
    </div>
  );
}
