import React from 'react';
import { useSanCti } from './SanCtiContext';

interface CallNowButtonProps {
  phoneNumber: string;
  leadUserId: number | string;
  driverName?: string;
  disabled?: boolean;
}

/**
 * Call Now button for lead cards.
 */
export default function CallNowButton({ phoneNumber, leadUserId, disabled }: CallNowButtonProps) {
  const { dial, callState, agentState } = useSanCti();

  const isAvailable = agentState === 'ready' && callState === 'idle';
  const isDisabled = disabled || !isAvailable;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering any card click handlers
    if (isDisabled) return;
    dial(phoneNumber, leadUserId);
  };

  let tooltipText = 'Call Now';
  if (agentState !== 'ready') tooltipText = `CTI not ready (State: ${agentState})`;
  if (callState !== 'idle') tooltipText = `Already on a call (Call State: ${callState})`;

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      title={tooltipText}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 16px',
        borderRadius: 8,
        border: 'none',
        backgroundColor: isDisabled ? '#E5E7EB' : '#22C55E',
        color: isDisabled ? '#9CA3AF' : '#fff',
        fontSize: 13,
        fontWeight: 600,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      📞 Call
    </button>
  );
}
