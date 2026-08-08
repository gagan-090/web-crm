import { useEffect, useState } from 'react';
import { getCrmTheme, subscribeToCrmTheme, refreshCrmTheme } from './crmTheme';
import type { CrmThemePayload } from './crmTheme';

export interface CrmThemeState {
  theme: CrmThemePayload;
  slug: string;
  /** The one flag nearly every component needs. */
  isTricolor: boolean;
  /** options.* from the server row, with sane defaults. */
  showDashboardDecor: boolean;
  greetingHi: string;
  greetingEn: string;
  bannerPill: string;
  bannerTagline: string;
}

const str = (v: unknown, fallback: string) => (typeof v === 'string' && v.trim() ? v : fallback);

/**
 * Subscribe a component to the live theme.
 *
 * A hook rather than the old `IS_TRICOLOR_THEME` constant, because the theme now
 * arrives from the server after first paint — a module-level boolean would be
 * captured at import time and could never update when the answer lands (or when
 * an admin flips the skin mid-shift).
 *
 * Reading is synchronous and never suspends: the module already applied the
 * cached theme before React mounted.
 */
export const useCrmTheme = (): CrmThemeState => {
  const [theme, setTheme] = useState<CrmThemePayload>(getCrmTheme);

  useEffect(() => subscribeToCrmTheme(setTheme), []);

  const options = theme.options || {};
  const isTricolor = theme.slug === 'tricolor';

  return {
    theme,
    slug: theme.slug,
    isTricolor,
    // Decor defaults to "on" for a festive theme so a row created without
    // options still looks intentional.
    showDashboardDecor: options.dashboard_decor === undefined ? isTricolor : !!options.dashboard_decor,
    greetingHi:    str(options.greeting_hi, 'स्वतंत्रता दिवस की शुभकामनाएँ'),
    greetingEn:    str(options.greeting_en, 'Happy Independence Day'),
    bannerPill:    str(options.banner_pill, 'स्वतंत्रता दिवस विशेष'),
    bannerTagline: str(options.banner_tagline, 'जय हिन्द · Vande Mataram'),
  };
};

export { refreshCrmTheme };
export type { CrmThemePayload };
export default useCrmTheme;
