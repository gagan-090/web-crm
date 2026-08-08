import { API_BASE_URL, CRM_THEME } from '../constants/config';

/**
 * The CRM's theme runtime.
 *
 * The skin is served by the backend (`GET /web-crm/theme`, see
 * WebCrm\CrmThemeController), so turning the Independence Day look on and off
 * is a database row, not a rebuild. This module owns three jobs:
 *
 *   1. APPLY the slug to <html data-theme="…"> — every colour override in
 *      styles/theme-tricolor.css hangs off that attribute;
 *   2. AVOID THE FLASH. The network answer arrives well after first paint, so
 *      the last known theme is cached in localStorage and applied synchronously
 *      during module load. A returning agent never sees the default skin blink
 *      before the festive one;
 *   3. DEGRADE. No cache and no network — a fresh browser on a broken API —
 *      falls back to CRM_THEME in config.ts, so the CRM is never unstyled.
 */

export interface CrmThemePayload {
  slug: string;
  name?: string;
  description?: string | null;
  palette?: Record<string, string>;
  /** Optional absolute URLs; when absent the bundled artwork is used. */
  assets?: Record<string, string>;
  options?: Record<string, string | boolean | number>;
  starts_at?: string | null;
  ends_at?: string | null;
  version?: number;
}

const CACHE_KEY = 'crm_theme_payload';

const FALLBACK: CrmThemePayload = { slug: CRM_THEME, palette: {}, assets: {}, options: {} };

const readCache = (): CrmThemePayload | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.slug === 'string' ? parsed : null;
  } catch {
    return null;
  }
};

let current: CrmThemePayload = readCache() || FALLBACK;

type Listener = (t: CrmThemePayload) => void;
const listeners = new Set<Listener>();

/** Paints the slug onto <html>. Everything else keys off this attribute. */
const applyToDocument = (theme: CrmThemePayload) => {
  document.documentElement.dataset.theme = theme.slug;
};

export const getCrmTheme = (): CrmThemePayload => current;

export const subscribeToCrmTheme = (fn: Listener): (() => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

const setCrmTheme = (theme: CrmThemePayload) => {
  const changed = theme.slug !== current.slug || theme.version !== current.version;
  current = theme;
  applyToDocument(theme);
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(theme));
  } catch {
    /* private mode — the theme still works, it just re-fetches next load */
  }
  if (changed) listeners.forEach((fn) => fn(theme));
};

/** Applied at import time, before React mounts, from cache or fallback. */
applyToDocument(current);

/**
 * Ask the server what to wear. Safe to call repeatedly; a failure leaves the
 * cached theme in place rather than resetting the CRM mid-session.
 */
export const refreshCrmTheme = async (): Promise<CrmThemePayload> => {
  try {
    const res = await fetch(`${API_BASE_URL}/web-crm/theme`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`theme ${res.status}`);
    const body = await res.json();
    const payload: CrmThemePayload | undefined = body?.data;
    if (payload?.slug) setCrmTheme(payload);
  } catch {
    /* offline or API down — keep what we have */
  }
  return current;
};
