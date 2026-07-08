import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetDwCampaignLeadsQuery } from '../../../services/api/webCrmApi';
import { useAuth } from '../../../app/providers/AuthProvider';

export default function TollFreeNotifier() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isDwAgent = user?.role?.includes('DW') || user?.role?.includes('Welcome');

  // Fetch campaign leads with TollFree source and poll every 10 seconds
  const { data: campaignData } = useGetDwCampaignLeadsQuery(
    { source: 'TollFree' },
    {
      skip: !isDwAgent,
      pollingInterval: 10000,
      refetchOnMountOrArgChange: true,
    }
  );

  // Memoized on campaignData: without this, .filter().filter() allocates a
  // brand-new array on EVERY render (even ones caused by unrelated state
  // elsewhere in the tree), which made the effect below — keyed on `leads`
  // by reference — re-run and re-diff on every single render instead of
  // only when the underlying query data actually changes.
  const leads = useMemo(() => {
    return (campaignData?.leads || [])
      .filter((l: any) => !l.history || l.history.length === 0)
      .filter((l: any) => {
        const capturedTime = l.capturedTimestamp || (l.created_at ? new Date(l.created_at).getTime() : Date.now());
        return (Date.now() - capturedTime) <= 48 * 60 * 60 * 1000;
      });
  }, [campaignData]);
  const [activeLead, setActiveLead] = useState<any | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showBubble, setShowBubble] = useState<boolean>(false);
  const [seenLeadIds, setSeenLeadIds] = useState<Set<string>>(new Set());

  // Ref to track drag position - defaults to top-mid right corner
  const [bubblePos, setBubblePos] = useState({ x: window.innerWidth - 130, y: 150 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const bubbleRef = useRef<HTMLDivElement | null>(null);

  // Monitor for newly assigned TollFree leads
  useEffect(() => {
    if (!isDwAgent || leads.length === 0) {
      setShowBubble(false);
      setShowModal(false);
      return;
    }

    // Find any lead that we haven't seen yet
    const newLeads = leads.filter((l: any) => !seenLeadIds.has(String(l.id)));
    if (newLeads.length > 0) {
      // Pick the newest one
      const newestLead = newLeads[0];
      setActiveLead(newestLead);

      setShowModal(true);
      setShowBubble(false);

      // Add all current leads to seen
      const newSeen = new Set(seenLeadIds);
      leads.forEach((l: any) => newSeen.add(String(l.id)));
      setSeenLeadIds(newSeen);
    } else {
      // If we have leads but no modal is open, and bubble isn't shown, show bubble
      if (!showModal && leads.length > 0) {
        setActiveLead(leads[0]);
        setShowBubble(true);
      }
    }
  }, [leads, isDwAgent, seenLeadIds, showModal]);

  // Handle window resizing to keep the bubble in screen bounds
  useEffect(() => {
    const handleResize = () => {
      setBubblePos((prev) => ({
        x: Math.min(prev.x, window.innerWidth - 130),
        y: Math.min(prev.y, window.innerHeight - 80),
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCall = () => {
    if (!activeLead) return;
    setShowModal(false);
    setShowBubble(false);

    // Call softphone dialer
    if ((window as any)._sanDial) {
      const numericId = parseInt(String(activeLead.id).replace(/\D/g, ''), 10) || 0;
      (window as any)._sanDial(activeLead.phone, numericId, activeLead.name, activeLead.tmid, 'social_media');
    }

    // Navigate to focus screen
    navigate('/dw/dw-active-call-focus', {
      state: {
        userId: activeLead.id,
        leadId: activeLead.id,
        tmid: activeLead.tmid,
        name: activeLead.name,
        phone: activeLead.phone,
        mobile: activeLead.phone,
        location: activeLead.city && activeLead.state ? `${activeLead.city}, ${activeLead.state}` : 'TollFree Call',
        isCampaign: true,
        queueType: 'campaign',
        campaignContext: {
          source: activeLead.source,
          temperature: activeLead.temperature || 'HOT',
        }
      }
    });
  };

  const handleDismiss = () => {
    setShowModal(false);
    setShowBubble(true);
  };

  const dragDistance = useRef(0);
  // Live position ref, always fresh — lets the drag handlers below stay
  // referentially stable (useCallback with empty deps) instead of being
  // recreated every render, since they read position from here instead of
  // closing over the `bubblePos` state value. Synced via effect, not during
  // render, per this codebase's no-ref-writes-during-render rule.
  const bubblePosRef = useRef(bubblePos);
  useEffect(() => { bubblePosRef.current = bubblePos; }, [bubblePos]);

  // Drag handlers. Window-level mousemove/touchmove/mouseup/touchend
  // listeners are attached ONLY while a drag is in progress (from
  // handleStart until detachDragListenersRef.current() fires) instead of for the
  // component's entire lifetime. Previously they were permanently attached
  // AND re-subscribed on every bubblePos change — meaning every pixel of
  // movement during a drag tore down and re-added 4 window listeners, and
  // outside of any drag the notifier still ran a mousemove handler on every
  // mouse movement across the whole app for as long as a DW agent was
  // logged in. Every handler here is useCallback'd with an empty
  // dependency array (they only touch refs and the stable setBubblePos
  // dispatcher) so the SAME function reference is used for every
  // add/removeEventListener pair, no matter which render triggered it —
  // including the unmount safety net below.
  const handleMove = useCallback((clientX: number, clientY: number) => {
    const newX = Math.max(10, Math.min(clientX - dragStart.current.x, window.innerWidth - 130));
    const newY = Math.max(10, Math.min(clientY - dragStart.current.y, window.innerHeight - 80));

    const dx = newX - bubblePosRef.current.x;
    const dy = newY - bubblePosRef.current.y;
    dragDistance.current += Math.sqrt(dx * dx + dy * dy);

    setBubblePos({ x: newX, y: newY });
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => handleMove(e.clientX, e.clientY), [handleMove]);
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) handleMove(e.touches[0].clientX, e.touches[0].clientY);
  }, [handleMove]);

  // Held in a ref (rather than referencing the const from inside its own
  // useCallback body) purely so removeEventListener's 'mouseup'/'touchend'
  // handler can detach itself without a self-referential closure. The ref
  // is synced via effect, not during render.
  const detachDragListenersRef = useRef<() => void>(() => {});
  const detachDragListeners = useCallback(() => {
    isDragging.current = false;
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', detachDragListenersRef.current);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('touchend', detachDragListenersRef.current);
  }, [onMouseMove, onTouchMove]);
  useEffect(() => { detachDragListenersRef.current = detachDragListeners; }, [detachDragListeners]);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    isDragging.current = true;
    dragStart.current = { x: clientX - bubblePosRef.current.x, y: clientY - bubblePosRef.current.y };
    dragDistance.current = 0;
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', detachDragListenersRef.current);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', detachDragListenersRef.current);
  }, [onMouseMove, onTouchMove]);

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
    e.preventDefault();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  // Safety net: if the component unmounts mid-drag, don't leak listeners.
  // Reads the ref at cleanup time rather than closing over a snapshot, so it
  // always matches whatever detach function is currently attached.
  useEffect(() => () => detachDragListenersRef.current(), []);

  if (!isDwAgent || leads.length === 0) return null;

  return (
    <>
      {/* TollFree Popup Modal */}
      {showModal && activeLead && (
        // backdrop-blur-sm removed: a live GPU blur recomputed every frame
        // across the full viewport, while both the header (animate-pulse)
        // and the hot-lead badge (animate-ping) animate underneath/inside
        // it — this was the actual cause of the reported lag. A flat darker
        // overlay reads the same visually without the per-frame blur cost.
        <div className="fixed inset-0 bg-black/85 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border-4 border-red-500 shadow-2xl p-6 relative overflow-hidden">
            {/* Top red header banner */}
            <div className="bg-red-500 text-white text-center py-2 font-bold uppercase tracking-widest text-[11px] rounded-lg mb-4 flex items-center justify-center gap-1.5 animate-pulse">
              <span className="material-symbols-outlined text-[16px]">campaign</span>
              Priority TollFree Lead Assigned!
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-extrabold text-gray-900 leading-tight">
                  {activeLead.name || 'Incoming TollFree caller'}
                </h3>
                <p className="text-red-500 font-mono font-bold text-sm tracking-wider mt-1">
                  **********
                </p>
                <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                  HOT TOLLFREE LEAD
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Source:</span>
                  <span className="font-bold text-slate-800">{activeLead.source}</span>
                </div>
                <div className="flex justify-between">
                  <span>Captured:</span>
                  <span className="font-semibold text-slate-700">{activeLead.capturedTime}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-all text-xs"
                >
                  Minimize to Bubble
                </button>
                <button
                  type="button"
                  onClick={handleCall}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-md shadow-red-500/20 text-xs flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Minimize Bubble */}
      {showBubble && activeLead && (
        <div
          ref={bubbleRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{
            position: 'fixed',
            top: `${bubblePos.y}px`,
            left: `${bubblePos.x}px`,
            zIndex: 9998,
            cursor: 'grab',
          }}
          onClick={() => {
            if (dragDistance.current < 8) {
              setShowModal(true);
              setShowBubble(false);
            }
          }}
          className="bg-red-500 text-white p-3 rounded-full shadow-2xl flex items-center justify-center gap-2 hover:bg-red-600 transition-colors animate-bounce select-none"
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[24px]">call</span>
            <span className="absolute -top-1.5 -right-1.5 bg-white text-red-600 text-[8px] font-extrabold px-1 py-0.5 rounded-full border border-red-500 flex items-center justify-center min-w-[14px]">
              {leads.length}
            </span>
          </div>
          <span className="text-[10px] font-bold pr-1">TollFree</span>
        </div>
      )}
    </>
  );
}
