import React, { createContext, useContext } from 'react';

// Context, hook, and shared types for the SAN CTI integration.
//
// Deliberately kept in a file separate from SanCtiProvider.tsx: a module that
// exports both React components and plain values (context object, hook) is not
// Fast-Refresh-safe — editing it during `vite dev` leaves consumers holding a
// stale SanCtiContext instance, and every useSanCti() call then throws
// "useSanCti must be used within a SanCtiProvider" until a full page reload.
// With the context isolated here, SanCtiProvider.tsx exports only a component
// and hot-reloads cleanly.

export interface DispositionData {
  disposition: string;
  notes?: string | null;
  callback_at?: string | null;
  reason?: string | null;
  plan_selected?: string | null;
  payment_id?: string | null;
  language_noted?: string | null;
  disposition_sub?: string | null;
  callback_sub?: string | null;
  feedback_stage?: string | null;
}

export interface ConferenceMember {
  /** The member's number as SAN reports it (may carry a 0 / +91 prefix). */
  conf_member: string;
  conf_exten?: string;
  /** 'hold' while SAN has this leg parked — set by its confhold events. */
  hold_status?: string;
  mute_status?: string;
  [key: string]: any;
}

export interface SanCtiContextType {
  agentState: string;
  callState: string;
  extension: string;
  isOnBreak: boolean;
  breakName: string;
  isManualMode: boolean;
  isHeld: boolean;
  /**
   * SAN never acknowledged the last hold/unhold. isHeld still reflects what we
   * commanded (the channel is usually genuinely in that state) — this only
   * says we could not confirm it, so the UI can show it as unverified instead
   * of silently flipping the label back.
   */
  isHoldUnconfirmed: boolean;
  isMuted: boolean;
  conferenceMembers: ConferenceMember[];
  conferenceDialingMembers: ConferenceMember[];
  callDuration: number;
  /**
   * SAN reported 'Answer' for this call. Authoritative "it connected" signal —
   * unlike callDuration, which is still 0 for a call answered and dropped
   * inside the same second. Disposition forms use it to drop the
   * not-connected outcomes.
   */
  callWasAnswered: boolean;
  /**
   * SAN has sent no event for 60s on a call that is still dialing/ringing, so
   * the state on the call bar is the last thing SAN said and may be stale. The
   * call is NOT torn down for this — only the agent ends a call.
   */
  statusUnconfirmed: boolean;
  currentCallId: number | null;
  currentLeadId: number | string | null;
  currentPhoneNumber: string;
  currentLeadName: string;
  currentLeadTmid: string;
  currentLeadType: string;
  currentLeadLocation: string;
  currentLeadCallStatus: string;
  isIncomingCall: boolean;
  isAcceptingIncoming: boolean;
  showDispositionForm: boolean;
  sanDispositionOptions: string[];
  login: () => void;
  goReady: () => void;
  dial: (phoneNumber: string, leadUserId: number | string, name?: string, tmid?: string, leadType?: string) => Promise<void>;
  hangup: () => void;
  toggleHold: () => void;
  toggleMute: () => void;
  startConference: () => void;
  addConferenceNumber: (phoneNumber: string) => void;
  /** Hold / resume a single conference member (SAN's ConfHoldToggle). */
  holdConferenceMember: (phoneNumber: string) => void;
  /** Show SAN's own softphone — the only place a single leg can be dropped. */
  showSoftphone: () => void;
  acceptIncoming: () => void;
  logout: () => void;
  toggleManualMode: () => void;
  submitDisposition: (dispositionData: DispositionData) => Promise<any>;
  setShowDispositionForm: React.Dispatch<React.SetStateAction<boolean>>;
  startMockCall?: (leadName?: string, phoneNumber?: string, tmid?: string) => void;
}

export const SanCtiContext = createContext<SanCtiContextType | null>(null);

export function useSanCti() {
  const context = useContext(SanCtiContext);
  if (!context) {
    throw new Error('useSanCti must be used within a SanCtiProvider');
  }
  return context;
}
