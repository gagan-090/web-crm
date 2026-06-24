import { useState, useEffect } from 'react';

interface ConversionDetail {
  role: string;
  planName: string;
  amount: number;
  totalAccrued: number;
  isUnlocked: boolean;
  isSalaryGateUnlocked?: boolean;
  isIncentiveGateUnlocked?: boolean;
}

export default function ConversionConfirmationToast() {
  const [toast, setToast] = useState<ConversionDetail | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    function handleConversion(event: Event) {
      const customEvent = event as CustomEvent<ConversionDetail>;
      setToast(customEvent.detail);
      setIsVisible(true);

      // Dismiss after 5 seconds to give time to read both gates
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }

    window.addEventListener('tm-connect-conversion', handleConversion);
    return () => window.removeEventListener('tm-connect-conversion', handleConversion);
  }, []);

  if (!toast) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 11000,
        width: 360,
        backgroundColor: '#1E293B',
        color: '#FFFFFF',
        borderRadius: 12,
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3), 0 10px 10px -5px rgba(0,0,0,0.2)',
        border: '1px solid #334155',
        padding: 16,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        transform: isVisible ? 'translateX(0)' : 'translateX(120%)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 'bold',
          }}
        >
          ✓
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#F8FAFC' }}>
            Conversion Recorded!
          </h4>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>
            {toast.role} · {toast.planName}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0F172A', padding: '10px 12px', borderRadius: 8, gap: 10, margin: '8px 0' }}>
        <div>
          <span style={{ display: 'block', fontSize: 9, textTransform: 'uppercase', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em', textAlign: 'left' }}>
            Incentive Earned
          </span>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#10B981', fontFamily: 'monospace', display: 'block', textAlign: 'left' }}>
            +₹{toast.amount}
          </span>
        </div>
        <div style={{ textAlign: 'right', marginLeft: 'auto' }}>
          <span style={{ display: 'block', fontSize: 9, textTransform: 'uppercase', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em' }}>
            New Accrued Total
          </span>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#F8FAFC', fontFamily: 'monospace', display: 'block' }}>
            ₹{toast.totalAccrued.toLocaleString()}
          </span>
        </div>
      </div>

      <div style={{ fontSize: 11, color: '#E2E8F0', marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6, borderTop: '1px solid #334155', paddingTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-start', textAlign: 'left' }}>
          {toast.isSalaryGateUnlocked ? (
            <span style={{ color: '#34D399', fontWeight: 600 }}>
              🟢 Base Salary Gate: UNLOCKED
            </span>
          ) : (
            <span style={{ color: '#F59E0B' }}>
              🟡 Base Salary Gate: Locked
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-start', textAlign: 'left' }}>
          {toast.isIncentiveGateUnlocked ? (
            <span style={{ color: '#34D399', fontWeight: 600 }}>
              🟢 Incentives Gate: UNLOCKED (Incentives active)
            </span>
          ) : (
            <span style={{ color: '#F59E0B' }}>
              🟡 Incentives Gate: Locked (2x sale required)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
