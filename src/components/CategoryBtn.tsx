import React from 'react';
import { PlusCircle } from 'lucide-react';

export function CategoryBtn({ icon, label, count, onClick }: { icon: React.ReactNode; label: string; count: number; onClick: () => void }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3 text-sm font-medium text-brand-secondary dark:text-[#8aa4bc]">
        {icon}
        <span>{label}</span>
        <span className="text-[10px] text-brand-muted dark:text-[#5a7a96] font-mono">({count})</span>
      </div>
      <button
        onClick={onClick}
        className="p-1 rounded-lg hover:bg-brand-hover text-brand-muted dark:text-[#5a7a96] hover:text-brand-primary transition-all opacity-0 group-hover:opacity-100"
      >
        <PlusCircle size={14} />
      </button>
    </div>
  );
}
