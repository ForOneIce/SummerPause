import React from 'react';

export function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={active ? 'sidebar-btn-active w-full' : 'sidebar-btn w-full'}
    >
      {active && <div className="w-2 h-2 rounded-full bg-brand-primary"></div>}
      {!active && <div className="w-2 h-2 rounded-full border border-brand-secondary dark:border-[#5a7a96]"></div>}
      <span className="hidden md:block font-medium">{label}</span>
    </button>
  );
}
