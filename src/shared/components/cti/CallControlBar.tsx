import React, { useState } from 'react';
import { useSanCti } from './SanCtiContext';
import { useAuth } from '../../../app/providers/AuthProvider';
import useCrmTheme from '../../theme/useCrmTheme';
import {
  readPendingMmContext,
  recordMmConferenceParty,
  emitMmConferenceAdd,
  emitMmOpenAddToCall,
} from './mmCallContext';

interface CallControlBarProps {
  driverName?: string;
}

/**
 * Floating call control bar — bottom-right of screen.
 * Only visible when callState !== 'idle'.
 */
export default function CallControlBar({ driverName }: CallControlBarProps) {
  const { isTricolor: IS_TRICOLOR_THEME } = useCrmTheme();
  const {
    callState,
    callDuration,
    statusUnconfirmed,
    isHeld,
    isHoldUnconfirmed,
    isMuted,
    hangup,
    toggleHold,
    toggleMute,
    currentLeadName,
    isIncomingCall,
    conferenceMembers,
    conferenceDialingMembers,
    extension,
    startConference,
    addConferenceNumber,
    holdConferenceMember,
    showSoftphone,
  } = useSanCti();

  const [showConferencePanel, setShowConferencePanel] = useState(false);
  const [conferenceInput, setConferenceInput] = useState('');

  // Conference (Add Call) is NOT offered to Transporter Welcome agents.
  // Driver Welcome has it re-enabled FOR TESTING (user request 2026-07-08) —
  // as a manual button only, never auto-armed: pressing it converts the live
  // call into a SAN conference bridge, and a bridged call does NOT end when
  // the far end hangs up — the agent must hang up manually.
  const { user } = useAuth();
  const role = user?.role || '';
  const conferenceAllowed = !(
    role.includes('TW') || role.includes('WCT') || role.includes('Transporter')
  );

  // Name only — never fall through to a raw phone number on the call bar.
  const activeName = driverName || currentLeadName || 'Caller';

  // ── Matchmaking conference target ──
  // On an applicant call the job's transporter travels along in the MM call
  // context, so "Add Call" can offer them BY NAME. Their mobile number is used
  // to place the conference leg but is never rendered anywhere in the UI, and
  // the extension / agent-DID inputs are not offered for this flow at all.
  const mmCtx = readPendingMmContext();
  const mmConferenceParty = mmCtx?.conferenceParty;
  // On a TRANSPORTER call the counterpart isn't known up front — the agent
  // searches the job's applicants by name/TMID in the matchmaking screen's
  // picker, which the call bar can only ask for (it has no applicant data).
  const mmCanSearchApplicants = mmCtx?.kind === 'transporter';
  const mmAlreadyAdded = !!mmConferenceParty
    && (mmCtx?.conferenced || []).some(p => p.id === mmConferenceParty.id);

  /**
   * SAN reports conference members by phone number. For matchmaking parties we
   * substitute the name so the transporter's number is never rendered — match
   * on the last 10 digits since SAN may prefix a 0 / +91.
   */
  const mmMemberLabel = (raw?: string): string => {
    const digits = (raw || '').replace(/\D/g, '').slice(-10);
    const known = [...(mmCtx?.conferenced || []), ...(mmConferenceParty ? [mmConferenceParty] : [])];
    const hit = digits ? known.find(p => p.mobile.replace(/\D/g, '').slice(-10) === digits) : undefined;
    // Name only — never surface the raw mobile/number on the roster.
    return hit ? hit.name : 'Added party';
  };

  // Is the MM counterpart genuinely bridged in right now? Drives the button
  // label so "Added" can't sit next to a stale row for someone who has left.
  const mmPartyOnCall = !!mmConferenceParty && conferenceMembers.some(
    m => (m.conf_member || '').replace(/\D/g, '').slice(-10) === mmConferenceParty.mobile.replace(/\D/g, '').slice(-10)
  );

  const addMmPartyToCall = () => {
    if (!mmConferenceParty || !mmCtx) return;
    // Both are safe to call in any order: startConference is a no-op once this
    // call is already in conference mode (opening the panel below also enters
    // it), and addConferenceNumber waits for SAN to settle before dialing.
    startConference();
    addConferenceNumber(mmConferenceParty.mobile);
    recordMmConferenceParty(mmConferenceParty);
    emitMmConferenceAdd({ ...mmConferenceParty, jobId: mmCtx.jobId });
  };

  if (callState === 'idle' || callState === 'disposition_pending') return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  interface StateConfigItem {
    dot: string;
    pulse: boolean;
    label: string;
    showTimer: boolean;
  }

  const stateConfig: Record<string, StateConfigItem> = {
    dialing:          { dot: '#FCD34D', pulse: true,  label: 'Dialing...',    showTimer: false },
    ringing:          { dot: '#FCD34D', pulse: true,  label: 'Ringing...',    showTimer: false },
    connected:        { dot: '#22C55E', pulse: false, label: 'Connected',     showTimer: true },
    incoming_ringing: { dot: '#3B82F6', pulse: true,  label: 'Incoming Call', showTimer: false },
  };

  // Every label above is only as current as SAN's last event. Once the provider
  // flags the status unconfirmed (60s of silence from SAN), the bar stops
  // asserting "Dialing..." — which is what agents were reading as a wrong
  // status while the call was in fact live — and says what it actually knows.
  const cfg = statusUnconfirmed
    ? { dot: '#F97316', pulse: false, label: 'Call in progress — status unconfirmed', showTimer: false }
    : (stateConfig[callState] || stateConfig.dialing);

  return (
    <>
      {conferenceAllowed && showConferencePanel && callState === 'connected' && (
        <div style={{
          position: 'fixed',
          bottom: 96,
          right: 24,
          backgroundColor: '#1F2937',
          borderRadius: 16,
          padding: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          zIndex: 9999,
          color: '#fff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          width: 280,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Add to Call</div>

          {mmConferenceParty ? (
            /* Matchmaking: the counterpart is already known, so the agent picks
               a NAME — no number, extension or agent-DID entry at all. */
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 6 }}>
                {mmConferenceParty.role === 'transporter' ? 'Transporter for this job' : 'Applicant'}
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
                backgroundColor: '#111827', borderRadius: 8, padding: '8px 10px',
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {mmConferenceParty.name}
                </span>
                <button
                  onClick={addMmPartyToCall}
                  disabled={mmAlreadyAdded}
                  title={mmPartyOnCall
                    ? 'Already on this call — see the member list below'
                    : mmAlreadyAdded ? 'Already requested for this call' : 'Bridge into the current call'}
                  style={{
                    ...btnStyle,
                    backgroundColor: mmAlreadyAdded ? '#374151' : '#4F46E5',
                    cursor: mmAlreadyAdded ? 'default' : 'pointer',
                    flexShrink: 0,
                  }}
                >
                  {mmPartyOnCall ? 'On call' : mmAlreadyAdded ? 'Added' : 'Add'}
                </button>
              </div>
            </div>
          ) : mmCanSearchApplicants ? (
            /* Transporter call: find the applicant by name or TMID. */
            <button
              onClick={emitMmOpenAddToCall}
              style={{
                ...btnStyle,
                backgroundColor: '#4F46E5',
                width: '100%',
                marginBottom: 12,
                padding: '8px 14px',
              }}
            >
              Search applicant by name / TMID
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                type="text"
                value={conferenceInput}
                onChange={(e) => setConferenceInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && conferenceInput.trim()) {
                    addConferenceNumber(conferenceInput.trim());
                    setConferenceInput('');
                  }
                }}
                placeholder="Enter phone number"
                style={{
                  flex: 1,
                  borderRadius: 8,
                  border: '1px solid #374151',
                  backgroundColor: '#111827',
                  color: '#fff',
                  padding: '6px 10px',
                  fontSize: 13,
                  outline: 'none',
                }}
              />
              <button
                onClick={() => {
                  if (!conferenceInput.trim()) return;
                  addConferenceNumber(conferenceInput.trim());
                  setConferenceInput('');
                }}
                style={{ ...btnStyle, backgroundColor: '#4F46E5' }}
              >
                Add
              </button>
            </div>
          )}

          {(
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {/* The primary connected party — always on the call, so the
                  roster is never empty while a call is up. */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6,
                backgroundColor: '#111827', borderRadius: 8, padding: '6px 10px', fontSize: 13,
              }}>
                <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentLeadName || 'Connected caller'}
                </span>
                {/* isHoldUnconfirmed = SAN never acked the hold. The state
                    shown is still the one we commanded (the caller normally IS
                    held); the "?" says only that we could not verify it. */}
                <span style={{ fontSize: 11, color: isHeld ? '#FCD34D' : '#22C55E', flexShrink: 0 }}>
                  {isHeld ? 'On hold' : 'On call'}
                  {isHoldUnconfirmed && (
                    <span
                      title="SAN did not confirm this hold. The caller is most likely still held — check the softphone if unsure."
                      style={{ marginLeft: 4, color: '#F59E0B', fontWeight: 700, cursor: 'help' }}
                    >?</span>
                  )}
                </span>
              </div>

              {/* The agent's own line — their SAN extension / DID. */}
              {extension && (
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6,
                  backgroundColor: '#111827', borderRadius: 8, padding: '6px 10px', fontSize: 13,
                }}>
                  <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    You
                  </span>
                  <span style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0 }}>Agent</span>
                </div>
              )}

              {conferenceDialingMembers.map((m, i) => (
                <div key={`dialing-${m.conf_member || m.caller_id || i}`} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  backgroundColor: '#111827', borderRadius: 8, padding: '6px 10px', fontSize: 13,
                }}>
                  <span>{mmMemberLabel(m.conf_member || m.caller_id)}</span>
                  <span style={{ fontSize: 11, color: '#FCD34D' }}>Dialing...</span>
                </div>
              ))}
              {conferenceMembers
                // The agent's own extension is bridged into every conference —
                // listing it as a "member" just confuses the roster.
                .filter(m => (m.conf_member || '') !== extension)
                .map((m, i) => (
                <div key={`member-${m.conf_member || i}`} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6,
                  backgroundColor: '#111827', borderRadius: 8, padding: '6px 10px', fontSize: 13,
                }}>
                  <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {mmMemberLabel(m.conf_member)}
                  </span>
                  <span style={{ fontSize: 11, color: m.hold_status === 'hold' ? '#FCD34D' : '#22C55E', flexShrink: 0 }}>
                    {m.hold_status === 'hold' ? 'On hold' : 'On call'}
                  </span>
                  <button
                    onClick={() => holdConferenceMember(m.conf_member)}
                    title={m.hold_status === 'hold' ? 'Resume this party' : 'Put this party on hold'}
                    style={{ ...btnStyle, backgroundColor: '#374151', padding: '2px 8px', fontSize: 11, flexShrink: 0 }}
                  >
                    {m.hold_status === 'hold' ? 'Resume' : 'Hold'}
                  </button>
                  <button
                    onClick={showSoftphone}
                    title="End just this party. SAN doesn't allow dropping one leg from the CRM, so this opens the SAN panel where you tap the remove (person-) icon next to this party — the rest of the call stays connected."
                    style={{ ...btnStyle, backgroundColor: '#B91C1C', padding: '2px 8px', fontSize: 11, flexShrink: 0 }}
                  >
                    End
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={IS_TRICOLOR_THEME ? {
      position: 'fixed',
      bottom: 24,
      right: 24,
      background: 'linear-gradient(135deg, #0C1A3A 0%, #17376B 60%, #0D2B1A 100%)',
      borderRadius: 18,
      padding: '13px 22px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      boxShadow: '0 12px 40px rgba(12,26,58,0.55), 0 0 0 1.5px rgba(184,134,11,0.45), 0 0 28px rgba(255,153,51,0.18)',
      zIndex: 9999,
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minWidth: 340,
      backdropFilter: 'blur(12px)',
      borderTop: '2px solid transparent',
      backgroundClip: 'padding-box',
    } : {
      position: 'fixed',
      bottom: 24,
      right: 24,
      backgroundColor: '#1F2937',
      borderRadius: 16,
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      zIndex: 9999,
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minWidth: 320,
    }}>
      {/* Status dot */}
      <div style={{
        width: 12, height: 12, borderRadius: '50%',
        backgroundColor: cfg.dot,
        animation: cfg.pulse ? 'pulse 1.5s infinite' : 'none',
        flexShrink: 0,
      }} />

      {/* Caller name + status */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isIncomingCall && (
            <span style={{
              fontSize: 10, fontWeight: 700, backgroundColor: '#3B82F6',
              color: '#fff', borderRadius: 4, padding: '1px 5px', letterSpacing: '0.5px',
              flexShrink: 0,
            }}>
              INCOMING
            </span>
          )}
          <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activeName}
          </div>
        </div>
        <div style={{ fontSize: 12, color: statusUnconfirmed ? '#FDBA74' : '#9CA3AF', marginTop: 1 }}>
          {cfg.label} {cfg.showTimer && `— ${formatTime(callDuration)}`}
        </div>
        {statusUnconfirmed && (
          <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2 }}>
            SAN stopped reporting — press Hangup when the call ends to log it.
          </div>
        )}
      </div>

      {/* Call controls */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        {/* No Answer button: the SAN widget auto-expands to full size while
            incoming_ringing specifically so the agent answers with a real
            click on SAN's own native button — the only path that reliably
            carries two-way audio. A postMessage-only Answer button here
            would either replace that (losing the real click) or fire
            alongside it (a double-answer that corrupts the call setup). */}
        {callState === 'incoming_ringing' && (
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#FCD34D',
            whiteSpace: 'nowrap',
          }}>
            👈 Answer from the SAN Softphone widget
          </span>
        )}

        {callState === 'connected' && (
          <>
            <button onClick={toggleHold} style={{
              ...btnStyle,
              background: IS_TRICOLOR_THEME
                ? (isHeld ? 'linear-gradient(135deg,#B8860B,#D4A017)' : 'rgba(255,255,255,0.12)')
                : (isHeld ? '#F59E0B' : '#374151'),
              border: IS_TRICOLOR_THEME ? '1px solid rgba(184,134,11,0.5)' : 'none',
              color: '#fff',
            }}>
              {isHeld ? 'Resume' : 'Hold'}
            </button>
            <button onClick={toggleMute} style={{
              ...btnStyle,
              background: IS_TRICOLOR_THEME
                ? (isMuted ? 'linear-gradient(135deg,#C0392B,#E74C3C)' : 'rgba(255,255,255,0.12)')
                : (isMuted ? '#EF4444' : '#374151'),
              border: IS_TRICOLOR_THEME ? '1px solid rgba(255,255,255,0.15)' : 'none',
              color: '#fff',
            }}>
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
            {conferenceAllowed && (
              <button
                onClick={() => {
                  // Only OPEN the panel here — do NOT enter conference mode yet.
                  // SAN's new-call state goes stale if the ConfrenceToggle fires
                  // long before the number is dialed (the agent still has to
                  // search/pick the applicant), so the toggle is fired right
                  // before the number instead — see addConferenceNumber /
                  // addMmPartyToCall / addApplicantToConference.
                  setShowConferencePanel(prev => !prev);
                }}
                style={{
                  ...btnStyle,
                  background: IS_TRICOLOR_THEME
                    ? (showConferencePanel ? 'linear-gradient(135deg,#3730A3,#4F46E5)' : 'rgba(255,255,255,0.12)')
                    : (showConferencePanel ? '#4F46E5' : '#374151'),
                  border: IS_TRICOLOR_THEME ? '1px solid rgba(255,255,255,0.15)' : 'none',
                }}
              >
                Add Call
              </button>
            )}
          </>
        )}

        <button onClick={hangup} style={{
          ...btnStyle,
          background: IS_TRICOLOR_THEME
            ? 'linear-gradient(135deg,#B33A00,#E05615,#FF6B35)'
            : '#EF4444',
          boxShadow: IS_TRICOLOR_THEME ? '0 4px 14px rgba(226,118,27,0.45)' : 'none',
          border: IS_TRICOLOR_THEME ? '1px solid rgba(255,153,51,0.35)' : 'none',
          fontWeight: IS_TRICOLOR_THEME ? 700 : 500,
        }}>
          Hangup
        </button>
      </div>

      {/* Tri-color top accent stripe */}
      {IS_TRICOLOR_THEME && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg,#FF9933 33%,rgba(255,255,255,0.85) 33%,rgba(255,255,255,0.85) 66%,#138808 66%)',
          borderRadius: '18px 18px 0 0',
          pointerEvents: 'none',
        }} />
      )}

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
      </div>
    </>
  );
}

const btnStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 8,
  padding: '6px 14px',
  color: '#fff',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
};
