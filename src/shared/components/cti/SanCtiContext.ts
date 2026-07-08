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
  conf_member: string;
  conf_exten?: string;
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
  isMuted: boolean;
  conferenceMembers: ConferenceMember[];
  conferenceDialingMembers: ConferenceMember[];
  callDuration: number;
  currentCallId: number | null;
  currentLeadId: number | string | null;
  currentPhoneNumber: string;
  currentLeadName: string;
  currentLeadTmid: string;
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
