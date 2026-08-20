/**
 * ============================================================================
 * Dark mode — a per-agent preference, not a server-driven skin
 * ============================================================================
 *
 * Deliberately separate from `crmTheme.ts`. That module carries the BRAND skin
 * (tricolor and friends) which an admin sets for the whole CRM; this is one
 * agent deciding how bright their own screen is at 11pm. Folding the two
 * together would mean an admin's brand choice could override a personal comfort
 * setting, and a personal setting could leak into everyone else's browser.
 *
 * Stored in localStorage rather than on the server for the same reason: it is a
 * property of this machine and this person, and it must survive a failed
 * network call — an agent whose preference vanishes because an API was slow
 * will simply stop using the toggle.
 *
 * APPLIED BEFORE REACT MOUNTS. main.tsx imports this module for its side
 * effect, so `.dark` is on <html> during first paint. Waiting for a React
 * effect would flash the full light UI on every reload, which is worse than
 * having no dark mode at all.
 */

const STORAGE_KEY = 'crm_dark_mode';

export type ThemeMode = 'light' | 'dark';

type Listener = (mode: ThemeMode) => void;
const listeners = new Set<Listener>();

/** What the OS says, used only when the agent has never chosen. */
const systemPrefersDark = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const readStored = (): ThemeMode | null => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'dark' || v === 'light' ? v : null;
  } catch {
    // Private browsing / storage disabled. Not a reason to fail — fall back to
    // the OS preference and keep the toggle working for this session.
    return null;
  }
};

let current: ThemeMode = readStored() ?? (systemPrefersDark() ? 'dark' : 'light');

/** Put the class on <html>. Tailwind's darkMode:'class' keys off exactly this. */
const apply = (mode: ThemeMode) => {
  const root = document.documentElement;
  root.classList.toggle('dark', mode === 'dark');
  // Also as an attribute: the CSS override layer selects on `.dark`, but
  // `color-scheme` below needs the browser to know too, so native controls
  // (scrollbars, date pickers, form fields) render dark instead of staying
  // stubbornly white against a dark page.
  root.style.colorScheme = mode === 'dark' ? 'dark' : 'light';
};

// Side effect on import — see the note at the top about first paint.
if (typeof document !== 'undefined') {
  apply(current);
}

export const getThemeMode = (): ThemeMode => current;

export const setThemeMode = (mode: ThemeMode) => {
  if (mode === current) return;
  current = mode;
  apply(mode);
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Preference is still live for this session even if it cannot be persisted.
  }
  listeners.forEach((fn) => fn(mode));
};

export const toggleThemeMode = () => setThemeMode(current === 'dark' ? 'light' : 'dark');

/** Subscribe; returns an unsubscribe suitable for a useEffect cleanup. */
export const subscribeToThemeMode = (fn: Listener): (() => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};
