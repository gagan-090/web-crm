import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetDriverBankNotificationsQuery,
  useReadDriverBankNotificationsMutation,
} from '../../services/api/webCrmApi';

/**
 * "A new driver was banked" alert for MATCHMAKING callers.
 *
 * A driver added to the Driver Bank from either panel — this CRM or the TM
 * Connect app — is a lead a matchmaking caller can pick up immediately, so the
 * alert is raised centrally and surfaces here.
 *
 * Mounted globally in DashboardLayout: the point is that a caller learns about
 * a new driver wherever they happen to be working, not only on the bank screen.
 * The endpoint returns nothing for non-matchmaking desks, so this renders
 * nothing for them without needing to know the role rules itself.
 */
const POLL_MS = 60_000;

export const DriverBankNotifier: React.FC = () => {
  const navigate = useNavigate();
  const { data, refetch } = useGetDriverBankNotificationsQuery(undefined, {
    pollingInterval: POLL_MS,
    refetchOnMountOrArgChange: true,
  });
  const [markRead] = useReadDriverBankNotificationsMutation();

  // Locally hidden ids, so dismissing feels instant instead of waiting for the
  // POST and the next poll to agree.
  const [hidden, setHidden] = useState<number[]>([]);

  const items = (data?.data ?? []).filter(n => !hidden.includes(n.id));

  // A caller who dismisses everything shouldn't see the same batch again after
  // the next poll — clear the local list once the server has caught up.
  useEffect(() => {
    if (hidden.length && (data?.data ?? []).every(n => hidden.includes(n.id))) {
      setHidden(h => h.filter(id => (data?.data ?? []).some(n => n.id === id)));
    }
  }, [data, hidden]);

  if (items.length === 0) return null;

  const dismiss = async (ids: number[]) => {
    setHidden(h => [...h, ...ids]);
    try {
      await markRead({ ids }).unwrap();
      refetch();
    } catch {
      // Server didn't record it — put them back so the caller isn't silently
      // deprived of the alert.
      setHidden(h => h.filter(id => !ids.includes(id)));
    }
  };

  const openBank = async () => {
    await dismiss(items.map(n => n.id));
    navigate('/mm/mm-driver-bank');
  };

  // Newest first, capped — a burst of additions shouldn't wall off the screen.
  const shown = items.slice(0, 3);
  const extra = items.length - shown.length;

  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-col gap-2 max-w-sm">
      {shown.map(n => (
        <div
          key={n.id}
          className="bg-white border border-teal-200 rounded-xl shadow-lg overflow-hidden animate-in slide-in-from-right duration-300"
        >
          <div className="flex items-start gap-3 p-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px] text-teal-700">person_add</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-extrabold text-gray-800 leading-snug">{n.title}</p>
              <p className="text-[10.5px] text-gray-500 mt-0.5">
                {n.body}
                {n.added_by_panel === 'tm_connect' ? ' · from the app' : ''}
              </p>
            </div>
            <button
              onClick={() => dismiss([n.id])}
              title="Dismiss"
              className="shrink-0 text-gray-300 hover:text-gray-500"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
          <div className="flex border-t border-gray-100">
            <button
              onClick={() => dismiss([n.id])}
              className="flex-1 py-2 text-[11px] font-bold text-gray-500 hover:bg-gray-50"
            >
              Dismiss
            </button>
            <button
              onClick={openBank}
              className="flex-1 py-2 text-[11px] font-extrabold text-white bg-teal-600 hover:bg-teal-700 flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              Open Driver Bank
            </button>
          </div>
        </div>
      ))}

      {extra > 0 && (
        <button
          onClick={openBank}
          className="bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-extrabold rounded-lg py-2 shadow-lg"
        >
          +{extra} more newly banked driver{extra === 1 ? '' : 's'} — open Driver Bank
        </button>
      )}
    </div>
  );
};

export default DriverBankNotifier;
