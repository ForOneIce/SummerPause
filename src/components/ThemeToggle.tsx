import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

export function ThemeToggle() {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="fixed bottom-8 right-8 z-[200] w-12 h-12 flex items-center justify-center
        bg-white dark:bg-[#0f1c2e] border border-brand-divider dark:border-[#1e3448]
        rounded-full custom-shadow-lg hover:border-brand-primary hover:-translate-y-1
        active:translate-y-0 transition-all group"
      title={isDark ? '切换浅色模式' : '切换深色模式'}
      aria-label={isDark ? '切换浅色模式' : '切换深色模式'}
    >
      {isDark ? (
        <Sun size={20} className="text-brand-primary group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon size={20} className="text-brand-secondary group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}
