import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ACTIVE_TAB_KEY, LEASE_RENEW_MS, LEASE_TTL_MS } from './sessionConfig';

// WhatsApp-style single-tab guard for the SAME browser.
//
// Two tabs/windows of the CRM in one browser share the same login (one
// localStorage token), so the backend single-session check can't separate
// them. This guard coordinates them purely client-side with a localStorage
// "lease": exactly one tab is active at a time; any other tab shows an "open in
// another window / Use Here" screen. Clicking Use Here hands the seat over.
//
// The lease is { tabId, ts, gen }. The active tab renews `ts` on an interval;
// a lease not renewed within LEASE_TTL_MS means that tab was closed and the
// seat is free. `gen` rises on an explicit Use Here takeover so a deliberate
// hand-over always beats an automatic claim; ties break deterministically on
// tabId so two tabs can never flap forever. Cross-tab reactions are instant via
// the browser 'storage' event, which fires in every OTHER tab on a write.

type Lease = { tabId: string; ts: number; gen: number };
type Mode = 'active' | 'passive';

const newTabId = (): string => {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  return c?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

function readLease(): Lease | null {
  try {
    const raw = localStorage.getItem(ACTIVE_TAB_KEY);
    if (!raw) return null;
    const l = JSON.parse(raw);
    if (typeof l?.tabId === 'string' && typeof l?.ts === 'number') {
      return { tabId: l.tabId, ts: l.ts, gen: typeof l.gen === 'number' ? l.gen : 0 };
    }
  } catch {
    /* corrupt / unavailable */
  }
  return null;
}

function writeLease(tabId: string, gen: number): void {
  try {
    localStorage.setItem(ACTIVE_TAB_KEY, JSON.stringify({ tabId, ts: Date.now(), gen }));
  } catch {
    /* storage unavailable — degrade to allowing this tab */
  }
}

export const SingleTabGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const tabId = useRef<string>(newTabId());
  const genRef = useRef<number>(0);

  // Decide active/passive SYNCHRONOUSLY on first render. A second tab that
  // finds a fresh foreign lease starts passive and therefore never mounts the
  // dashboard (or its SAN softphone iframe) even for a frame — mounting a
  // second SAN session in the same browser would clash with SAN's own
  // single-session lock.
  const [mode, setModeState] = useState<Mode>(() => {
    const l = readLease();
    const fresh = l !== null && Date.now() - l.ts < LEASE_TTL_MS;
    return !fresh || l!.tabId === tabId.current ? 'active' : 'passive';
  });
  const modeRef = useRef<Mode>(mode);

  const setMode = useCallback((m: Mode) => {
    modeRef.current = m;
    setModeState(m);
  }, []);

  const claim = useCallback((force: boolean) => {
    const baseGen = readLease()?.gen ?? 0;
    genRef.current = force ? baseGen + 1 : baseGen;
    writeLease(tabId.current, genRef.current);
    setMode('active');
  }, [setMode]);

  useEffect(() => {
    // Commit the first-render decision: an active tab writes/renews the lease;
    // a passive tab records the incumbent's generation for later tie-breaks.
    if (modeRef.current === 'active') {
      claim(false);
    } else {
      genRef.current = readLease()?.gen ?? 0;
    }

    // React instantly when another tab writes the lease.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== ACTIVE_TAB_KEY) return;
      const cur = readLease();
      if (!cur) return;
      if (cur.tabId === tabId.current) {
        setMode('active');
        return;
      }
      if (modeRef.current === 'active') {
        // Two tabs both believe they're active — resolve deterministically.
        if (cur.gen > genRef.current) {
          genRef.current = cur.gen;
          setMode('passive'); // explicit takeover wins
        } else if (cur.gen < genRef.current) {
          writeLease(tabId.current, genRef.current); // reassert; our gen is higher
        } else if (cur.tabId < tabId.current) {
          setMode('passive'); // equal gen → lower tabId wins
        } else {
          writeLease(tabId.current, genRef.current); // equal gen → we win, reassert
        }
      } else {
        genRef.current = cur.gen;
        setMode('passive');
      }
    };
    window.addEventListener('storage', onStorage);

    // Renew our lease while active; auto-claim a dead seat while passive.
    const iv = window.setInterval(() => {
      if (modeRef.current === 'active') {
        writeLease(tabId.current, genRef.current);
      } else {
        const cur = readLease();
        const stale = !cur || Date.now() - cur.ts >= LEASE_TTL_MS;
        if (stale) claim(false);
      }
    }, LEASE_RENEW_MS);

    // Free the seat immediately when the active tab closes.
    const release = () => {
      if (modeRef.current === 'active' && readLease()?.tabId === tabId.current) {
        try {
          localStorage.removeItem(ACTIVE_TAB_KEY);
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener('beforeunload', release);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('beforeunload', release);
      window.clearInterval(iv);
      release();
    };
  }, [claim, setMode]);

  if (mode === 'passive') {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/95 backdrop-blur-sm px-6">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-amber-500/30 p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 border border-amber-200">
            <span className="material-symbols-outlined text-[34px] text-amber-600">
              devices
            </span>
          </div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight">
            TM Connect is open in another window
          </h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Only one TM Connect window can be active at a time in this browser.
            Click <span className="font-semibold text-slate-700">Use Here</span> to
            switch to this window — the other one will go idle.
          </p>
          <button
            type="button"
            onClick={() => claim(true)}
            className="mt-6 w-full rounded-lg bg-gradient-to-r from-[#E2761B] via-[#C05E10] to-[#138808] py-2.5 text-sm font-bold text-white shadow-md hover:opacity-95 active:scale-[0.98] transition"
          >
            Use Here
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SingleTabGuard;
