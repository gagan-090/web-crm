import { useEffect, useRef, useState } from 'react';

/**
 * useState that survives navigation away and back.
 *
 * React Router unmounts a page when the agent opens a record and remounts it on
 * return, which resets every filter and scroll position — the screen looks like
 * it "reloaded". Persisting to sessionStorage restores exactly where the agent
 * left off, while still clearing when the browser tab closes.
 */
export function useStickyState<T>(key: string, initial: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = sessionStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or unavailable — the screen still works, just not sticky */
    }
  }, [key, value]);

  return [value, setValue];
}

/**
 * The record a list screen currently has open, remembered across navigation.
 *
 * Sticky filters aren't enough on their own: an agent who opens a job, steps
 * away through the sidebar and comes back landed on the list again instead of
 * the job they were working. Storing the open record lets the list bounce
 * straight back into it, and clearing it (the explicit "back to list" action)
 * is what returns the agent to the list.
 */
export const stickyOpenRecord = {
  get(key: string): string | null {
    try {
      return sessionStorage.getItem(key) || null;
    } catch {
      return null;
    }
  },
  set(key: string, id: string) {
    try {
      sessionStorage.setItem(key, id);
    } catch {
      /* storage unavailable — navigation still works, just not sticky */
    }
  },
  clear(key: string) {
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* nothing to do */
    }
  },
};

/**
 * Restores a scroll container's offset when the page is revisited.
 * Attach the returned ref to the scrollable element.
 */
export function useStickyScroll<T extends HTMLElement>(key: string) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const stored = Number(sessionStorage.getItem(key) || 0);
    if (stored > 0) {
      // After the first paint, so the restored list has height to scroll to.
      requestAnimationFrame(() => { el.scrollTop = stored; });
    }

    const onScroll = () => sessionStorage.setItem(key, String(el.scrollTop));
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [key]);

  return ref;
}
