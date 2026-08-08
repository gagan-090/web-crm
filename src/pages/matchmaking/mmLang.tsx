import React from 'react';
import type { MmLang } from '../../services/api/webCrmApi';

// ── Connection-request language badges ──────────────────────────────────────
//
// Every channel of a connection request (WhatsApp template, push title and the
// in-app notification body) is sent in the language the recipient picked in the
// mobile app — `users.user_lang`. A bulk send therefore mixes languages inside
// one batch, so the CRM shows per-recipient which one went out.
//
// Only en/hi/hn have approved templates. `pa` (Punjabi) is aliased to Hinglish
// server-side, and anything unknown falls back to English — the badge shows the
// language actually SENT, never the raw column value, so what the agent reads
// matches what the driver received.

const LANG_LABEL: Record<MmLang, string> = {
  en: 'English',
  hi: 'हिंदी',
  hn: 'Hinglish',
};

const LANG_CLASS: Record<MmLang, string> = {
  en: 'bg-sky-50 text-sky-700 border-sky-200',
  hi: 'bg-orange-50 text-orange-700 border-orange-200',
  hn: 'bg-violet-50 text-violet-700 border-violet-200',
};

export const langLabel = (lang?: string | null): string =>
  LANG_LABEL[(lang ?? 'en') as MmLang] ?? String(lang);

/**
 * Small language badge.
 * @param raw The recipient's untranslated `user_lang`, shown in the tooltip
 *            when it differs from what was sent (e.g. `pa` → Hinglish).
 */
export const LangChip: React.FC<{ lang?: string | null; raw?: string | null }> = ({ lang, raw }) => {
  if (!lang) return null;
  const key = (lang as MmLang) in LANG_LABEL ? (lang as MmLang) : 'en';
  const aliased = raw && raw.toLowerCase() !== lang.toLowerCase();
  return (
    <span
      title={aliased
        ? `Sent in ${LANG_LABEL[key]} — this user's app language is "${raw}", which has no approved template`
        : `Sent in ${LANG_LABEL[key]} (app language: ${lang})`}
      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${LANG_CLASS[key]}`}
    >
      {LANG_LABEL[key]}{aliased ? '*' : ''}
    </span>
  );
};
