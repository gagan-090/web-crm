import React from 'react';
import type { MmDriverExtraContact } from '../../services/api/webCrmApi';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';

// A driver's additional contacts (family / friends), added on the disposition
// of an MM Interview Done / Placement Done call. Each can be rung through the
// CTI: the call is logged under the DRIVER (lead_type 'driver_relative'), so it
// shows in his history as "called <relation> · <name>". Numbers are masked —
// matchmaking screens never display them; the dialler uses the real one.
export const DriverExtraContactsPanel: React.FC<{
  contacts: MmDriverExtraContact[];
  driverId: number;
  driverName: string;
  driverTmid: string;
  onToast?: (msg: string) => void;
  /** False on a read-only job or a driver another agent holds. */
  canCall?: boolean;
  disabledReason?: string;
  /** Hide the panel entirely when there is nothing to show. */
  hideWhenEmpty?: boolean;
}> = ({ contacts, driverId, driverName, driverTmid, onToast, canCall = true, disabledReason, hideWhenEmpty }) => {
  const { dial, agentState, callState } = useSanCti();

  if (hideWhenEmpty && contacts.length === 0) return null;

  const call = (c: MmDriverExtraContact) => {
    const say = onToast ?? ((m: string) => window.alert(m));
    if (!canCall) { say(disabledReason || 'You cannot call this driver\'s contacts.'); return; }
    if (agentState !== 'ready') { say('CTI agent is not ready yet — please wait a moment and try again.'); return; }
    if (callState !== 'idle') { say('Finish or hang up the current call first.'); return; }
    // The call bar and the disposition form show this name — it must say who
    // is actually being rung ("Ramu (Father of Manish Kumar)"), not the driver.
    // The call row itself stays the driver's: the backend takes the name from
    // user_id, and the relative from the extra_contact_* columns.
    const who = `${c.name || c.relation} (${c.relation} of ${driverName})`;
    dial(c.number, driverId, who, driverTmid, 'driver_relative');
    say(`Dialing ${who}…`);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3.5">
      <p className="text-[10px] font-extrabold uppercase tracking-wider mb-2 text-[#8E44AD] flex items-center gap-1">
        <span className="material-symbols-outlined text-[15px]">contact_phone</span>
        Additional Contacts <span className="text-gray-400 font-bold">({contacts.length})</span>
      </p>
      {contacts.length === 0 ? (
        <p className="text-[11px] text-gray-400 italic">
          None yet — they're asked for when the driver is marked Interview Done or Placement Done.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {contacts.map((c) => (
            <li key={c.number} className="py-1.5 flex items-center gap-2">
              <span className="text-[9px] font-extrabold uppercase bg-amber-50 text-amber-700 border border-amber-200 rounded px-1.5 py-0.5">
                {c.relation}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-gray-800 truncate">{c.name || '—'}</p>
                <p className="text-[10px] text-gray-400 font-mono">
                  {c.number_masked}{c.added_by ? ` · added by ${c.added_by}` : ''}
                </p>
              </div>
              <button
                onClick={() => call(c)}
                disabled={!canCall}
                className="bg-[#8E44AD] hover:bg-[#7D3C98] text-white px-2.5 py-1 rounded-lg font-bold text-[10px] inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                title={canCall ? `Call ${c.relation} of ${driverName}` : disabledReason}
              >
                <span className="material-symbols-outlined text-[14px]">call</span> Call
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DriverExtraContactsPanel;
