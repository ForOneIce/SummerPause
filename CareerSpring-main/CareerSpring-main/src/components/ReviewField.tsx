export function ReviewField({ label, value, onChange, isWarning = false }: { label: string; value: string; onChange: (v: string) => void; isWarning?: boolean }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest italic">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={3}
        className={`w-full bg-white dark:bg-[#0f1c2e] border ${isWarning ? 'border-[#DC26264D] focus:border-[#DC2626]' : 'border-brand-divider dark:border-[#1e3448] focus:border-brand-primary'} rounded-xl p-4 text-sm outline-none transition-all placeholder:text-brand-muted text-brand-ink dark:text-[#e0eaf4]`}
        placeholder={`记录${label}...`}
      />
    </div>
  );
}
