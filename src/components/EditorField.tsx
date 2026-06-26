export function EditorField({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-brand-muted dark:text-[#5a7a96] uppercase tracking-widest italic">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-white dark:bg-[#0f1c2e] border border-brand-divider dark:border-[#1e3448] rounded-xl p-3 text-sm focus:border-brand-primary outline-none transition-all placeholder:text-brand-muted text-brand-ink dark:text-[#e0eaf4]"
        placeholder={`输入${label}...`}
      />
    </div>
  );
}
