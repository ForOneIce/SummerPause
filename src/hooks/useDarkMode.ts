import { useLocalStorage } from './useLocalStorage';
import { useEffect } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useLocalStorage('summer_dark_mode', false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return [isDark, setIsDark] as const;
}
