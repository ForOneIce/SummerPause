export function IkigaiInput({ label, placeholder, value, onChange, color, bgColor }: { label: string; placeholder: string; value: string; onChange: (v: string) => void; color: string; bgColor: string }) {
  return (
    <div className="space-y-2">
      <label className={`text-[10px] font-bold uppercase tracking-widest ${color}`}>{label}</label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${bgColor} border-2 border-transparent focus:border-current rounded-[24px] p-4 outline-none transition-all min-h-[80px] text-sm ${color}`}
      />
    </div>
  );
}
