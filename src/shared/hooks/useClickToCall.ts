import { useDispatch } from 'react-redux';
import { setActiveDialerLead, setCallStatus, resetTimer } from '../../features/calls/slices/queueStateSlice';

export const useClickToCall = () => {
  const dispatch = useDispatch();

  const triggerCall = (
    name: string,
    phone: string,
    process: string = 'Click-to-Call Outbound',
    leadId: string = 'LD-' + Math.floor(1000 + Math.random() * 9000)
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

    // 3. Simulate connection after 2 seconds
    setTimeout(() => {
      dispatch(setCallStatus('connected'));
      dispatch(resetTimer());
    }, 2000);
  };

  return { triggerCall };
};

export default useClickToCall;
