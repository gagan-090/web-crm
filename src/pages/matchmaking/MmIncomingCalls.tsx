import React from 'react';
import IncomingCallHistory from '../shared/IncomingCallHistory';

// MM Incoming Call History — matchmaking works drivers AND transporters, so
// neither role wins the caller-number lookup; the row shows whichever account
// the number belongs to, tagged with its role.
export const MmIncomingCalls: React.FC = () => <IncomingCallHistory process="mm" />;

export default MmIncomingCalls;
