import { useLocalStorage } from './useLocalStorage';
import { useLayoutEffect } from 'react';

export function useDarkMode() {
  const [isDark, setIsDark] = useLocalStorage('summer_dark_mode', false);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return [isDark, setIsDark] as const;
}
