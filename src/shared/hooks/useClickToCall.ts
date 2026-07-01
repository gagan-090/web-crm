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
    extraState?: any
  ) => {
    // Intercept if SAN live dialer is active
    if ((window as any)._sanDial) {
      const numericId = parseInt(leadId.replace(/\D/g, ''), 10) || 0;
      
      // Determine target active call page based on route context
      const path = location.pathname;
      let targetPath = '';
      if (path.startsWith('/dw')) targetPath = '/dw/dw-active-call-focus';
      else if (path.startsWith('/wct')) targetPath = '/wct/wct-active-call-focus';
      else if (path.startsWith('/mm')) targetPath = '/mm/mm-active-call-focus-refined';
      else if (path.startsWith('/sc')) targetPath = '/sc/sc-active-call-focus';
      
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
