import React from 'react';
import IncomingCallHistory from '../shared/IncomingCallHistory';

// WCT-14: Incoming Call History — mirrors the DW screen, resolving caller
// numbers to transporter accounts first (a mobile shared by a driver and a
// transporter account belongs to the transporter in this process).
export const WctIncomingCalls: React.FC = () => <IncomingCallHistory process="wct" />;

export default WctIncomingCalls;
