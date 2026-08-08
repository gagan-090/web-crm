import React from 'react';
import MmDriverBank from '../matchmaking/MmDriverBank';

// The Driver Bank is role-agnostic — one shared table over /match-making/driver-bank
// that every process reads and writes. TWC gets the same screen DWC and MM have
// rather than a near-identical copy that would drift from them; the dial button
// routes to the WCT active-call screen because useClickToCall keys off the path.
export const WctDriverBank: React.FC = () => {
  return <MmDriverBank />;
};

export default WctDriverBank;
