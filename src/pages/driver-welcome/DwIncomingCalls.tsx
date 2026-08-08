import React from 'react';
import IncomingCallHistory from '../shared/IncomingCallHistory';

// DW-14: Incoming Call History — every call that rang on this driver-welcome
// agent's extension, with the caller's full lead record. The screen itself is
// shared with WCT and MM (pages/shared/IncomingCallHistory); only the number →
// lead resolution differs, and the backend decides that per process.
export const DwIncomingCalls: React.FC = () => <IncomingCallHistory process="dw" />;

export default DwIncomingCalls;
