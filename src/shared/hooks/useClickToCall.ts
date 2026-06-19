import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setActiveDialerLead, setCallStatus, resetTimer } from '../../features/calls/slices/queueStateSlice';
import { useGlobalOverlays } from '../context/GlobalOverlaysContext';

export const useClickToCall = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { startCall } = useGlobalOverlays();

  const triggerCall = (
    name: string,
    phone: string,
    process: string = 'Click-to-Call Outbound',
    leadId: string = 'LD-' + Math.floor(1000 + Math.random() * 9000),
    contextLine?: string
  ) => {
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
