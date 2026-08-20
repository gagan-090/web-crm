import { useEffect, useState } from 'react';
import { getThemeMode, setThemeMode, subscribeToThemeMode, toggleThemeMode } from './darkMode';
import type { ThemeMode } from './darkMode';

/**
 * Subscribe a component to the light/dark preference.
 *
 * Reading is synchronous and never suspends — darkMode.ts already applied the
 * stored preference before React mounted, so the first render is already
 * correct and there is no flash to guard against.
 */
export const useDarkMode = () => {
  const [mode, setMode] = useState<ThemeMode>(getThemeMode);

  useEffect(() => subscribeToThemeMode(setMode), []);

  return {
    mode,
    isDark: mode === 'dark',
    toggle: toggleThemeMode,
    setMode: setThemeMode,
  };
};

export default useDarkMode;
