import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setActiveDialerLead, setCallStatus, resetTimer } from '../../features/calls/slices/queueStateSlice';
import { useGlobalOverlays } from '../context/GlobalOverlaysContext';

export const useClickToCall = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { startCall } = useGlobalOverlays();

  const triggerCall = (
    name: string,
    phone: string,
    process: string = 'Click-to-Call Outbound',
    leadId: string = 'LD-' + Math.floor(1000 + Math.random() * 9000),
    contextLine?: string,
    extraState?: any,
    // The lead's real users.id. REQUIRED for the SAN dialer path: /call/initiate
    // validates user_id against the users table. When omitted we fall back to
    // digits parsed out of leadId — but a leadId like a TMID ("DR-1234") yields
    // a number that is NOT a valid users.id, which the backend rejects with
    // "The selected user id is invalid" and the call never starts. Always pass
    // the actual user id where the caller knows it (e.g. the Driver Bank).
    userId?: number
  ) => {
    // Intercept if SAN live dialer is active
    if ((window as any)._sanDial) {
      // When the caller supplies userId it opts into the "real users.id"
      // contract: use it as-is (0 → no linked user, which dial() forwards as a
      // null user_id so the backend resolves by phone instead of rejecting).
      // Only legacy callers that pass no userId fall back to parsing leadId.
      const numericId = userId === undefined
        ? (parseInt(leadId.replace(/\D/g, ''), 10) || 0)
        : (userId > 0 ? userId : 0);

      // Determine target active call page based on route context. These are the
      // real registered paths (see src/routes/index.tsx) — all four active-call
      // screens now live under the dashboard layout so SanCtiProvider is in
      // scope. A wrong path here matches no route and the "*" fallback bounces
      // the agent to "/" (the dashboard) mid-dial.
      const path = location.pathname;
      let targetPath = '';
      if (path.startsWith('/dw')) targetPath = '/dw/dw-active-call-focus';
      else if (path.startsWith('/wct')) targetPath = '/wct/wct-active-call-focus';
      else if (path.startsWith('/mm')) targetPath = '/mm/mm-active-call-focus-refined';
      else if (path.startsWith('/sc')) targetPath = '/sc/active-call-focus-special-categories';
      
      if (targetPath) {
        navigate(targetPath, {
          state: {
            userId: numericId,
            tmid: leadId,
            name: name,
            mobile: phone,
            ...extraState
          }
        });
      }
      
      (window as any)._sanDial(phone, numericId, name, leadId);
      return;
    }

    // 1. Set the active lead in Redux store
    dispatch(setActiveDialerLead({
      id: leadId,
      name,
      phone,
      process,
      status: 'NEW'
    }));

    // 2. Set call status to dialing
    dispatch(setCallStatus('dialing'));

    // 3. Detect role from current path context
    const path = location.pathname;
    let role = 'th';
    if (path.startsWith('/dw')) role = 'dw';
    else if (path.startsWith('/wct')) role = 'wct';
    else if (path.startsWith('/mm')) role = 'mm';
    else if (path.startsWith('/sc')) role = 'sc';

    // 4. Trigger the global floating Calling Keypad Modal
    startCall(name, phone, leadId, role, contextLine);

    // 5. Simulate connection after 2 seconds
    setTimeout(() => {
      dispatch(setCallStatus('connected'));
      dispatch(resetTimer());
    }, 2000);
  };

  return { triggerCall };
};

export default useClickToCall;
