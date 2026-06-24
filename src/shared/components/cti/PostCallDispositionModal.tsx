import React, { useState, useEffect } from 'react';
import { useSanCti } from './SanCtiProvider';

interface PostCallDispositionModalProps {
  driverName?: string;
  driverTmid?: string;
  onDispositionComplete?: (result: any) => void;
}

interface DispositionOption {
  value: string;
  label: string;
  label_hi: string;
  color: string;
  requires: string[];
}

/**
 * Post-Call Disposition Modal
 *
 * BLOCKING: No escape, no close button, no clicking outside.
 * The next lead DOES NOT load until this is submitted.
 * This is the #1 data integrity mechanism in the CRM.
 */
export default function PostCallDispositionModal({
  driverName,
  driverTmid,
  onDispositionComplete,
}: PostCallDispositionModalProps) {
  const {
    showDispositionForm,
    callDuration,
    submitDisposition,
    currentLeadName,
    currentLeadTmid,
  } = useSanCti();

  const activeName = driverName || currentLeadName || 'Unknown Driver';
  const activeTmid = driverTmid || currentLeadTmid || '';

  const [selectedDisposition, setSelectedDisposition] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [callbackAt, setCallbackAt] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [planSelected, setPlanSelected] = useState<string>('');
  const [paymentId, setPaymentId] = useState<string>('');
  const [languageNoted, setLanguageNoted] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Reset form when modal opens
  useEffect(() => {
    if (showDispositionForm) {
      setSelectedDisposition('');
      setNotes('');
      setCallbackAt('');
      setReason('');
      setPlanSelected('');
      setPaymentId('');
      setLanguageNoted('');
    }
  }, [showDispositionForm]);

  if (!showDispositionForm) return null;

  const dispositions: DispositionOption[] = [
    { value: 'converted',        label: 'Converted (Paid)',           label_hi: 'पेमेंट हो गया',           color: '#22C55E', requires: ['plan_selected', 'payment_id'] },
    { value: 'interested',       label: 'Interested (Will Pay Later)', label_hi: 'रुचि है, बाद में करेंगे', color: '#F59E0B', requires: ['callback_at', 'notes'] },
    { value: 'free_plan',        label: 'Staying on Free Plan',       label_hi: 'फ्री प्लान पर रहेंगे',    color: '#6B7280', requires: ['reason'] },
    { value: 'callback',         label: 'Call Back Later',            label_hi: 'बाद में कॉल करें',        color: '#3B82F6', requires: ['callback_at'] },
    { value: 'not_interested',   label: 'Not Interested',             label_hi: 'रुचि नहीं है',            color: '#EF4444', requires: ['reason'] },
    { value: 'wrong_number',     label: 'Wrong Number / Invalid',     label_hi: 'गलत नंबर',               color: '#9CA3AF', requires: [] },
    { value: 'language_barrier',  label: 'Language Barrier',           label_hi: 'भाषा की समस्या',         color: '#8B5CF6', requires: ['language_noted'] },
  ];

  const selected = dispositions.find(d => d.value === selectedDisposition);

  const canSubmit = () => {
    if (!selectedDisposition) return false;
    if (!selected) return false;
    const req = selected.requires;
    if (req.includes('plan_selected') && !planSelected) return false;
    if (req.includes('payment_id') && !paymentId) return false;
    if (req.includes('callback_at') && !callbackAt) return false;
    if (req.includes('reason') && !reason) return false;
    if (req.includes('notes') && !notes) return false;
    if (req.includes('language_noted') && !languageNoted) return false;
    return true;
  };

  const handleSubmit = async () => {
    if (!canSubmit() || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const result = await submitDisposition({
        disposition: selectedDisposition,
        notes,
        callback_at: callbackAt || null,
        reason: reason || null,
        plan_selected: planSelected || null,
        payment_id: paymentId || null,
        language_noted: languageNoted || null,
      });

      if (onDispositionComplete) {
        onDispositionComplete(result);
      }
    } catch (err) {
      console.error('[Disposition] Submit failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10000,
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        width: '100%',
        maxWidth: 480,
        maxHeight: '90vh',
        overflow: 'auto',
        padding: 32,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Header — NO close button. Intentional. */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>
            Call Ended — Tag This Call
          </h3>
          <p style={{ margin: '8px 0 0', fontSize: 14, color: '#6B7280' }}>
            {activeName} {activeTmid ? `(${activeTmid})` : ''} — {formatDuration(callDuration)}
          </p>
        </div>

        {/* Disposition radio buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {dispositions.map(d => (
            <label
              key={d.value}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 10,
                border: selectedDisposition === d.value
                  ? `2px solid ${d.color}`
                  : '1px solid #E5E7EB',
                cursor: 'pointer',
                backgroundColor: selectedDisposition === d.value ? `${d.color}10` : '#fff',
                transition: 'all 0.15s ease',
              }}
            >
              <input
                type="radio"
                name="disposition"
                value={d.value}
                checked={selectedDisposition === d.value}
                onChange={() => setSelectedDisposition(d.value)}
                style={{ accentColor: d.color }}
              />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{d.label}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>{d.label_hi}</div>
              </div>
            </label>
          ))}
        </div>

        {/* Dynamic fields based on selection */}
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {selected.requires.includes('plan_selected') && (
              <select value={planSelected} onChange={e => setPlanSelected(e.target.value)}
                style={inputStyle}>
                <option value="">Select Plan</option>
                <option value="199_plan">₹199 Basic</option>
                <option value="299_plan">₹299 Standard</option>
                <option value="499_plan">₹499 Premium</option>
                <option value="1999_plan">₹1,999 Pro</option>
                <option value="2999_plan">₹2,999 Super Pro</option>
              </select>
            )}

            {selected.requires.includes('payment_id') && (
              <input type="text" placeholder="Payment ID (e.g. pay_29N8...)"
                value={paymentId} onChange={e => setPaymentId(e.target.value)}
                style={inputStyle} />
            )}

            {selected.requires.includes('callback_at') && (
              <input type="datetime-local" value={callbackAt}
                onChange={e => setCallbackAt(e.target.value)}
                style={inputStyle} />
            )}

            {selected.requires.includes('reason') && (
              <select value={reason} onChange={e => setReason(e.target.value)}
                style={inputStyle}>
                <option value="">Select Reason</option>
                {selectedDisposition === 'not_interested' ? (
                  <>
                    <option value="already_have_loads">Already Have Loads</option>
                    <option value="using_other_app">Using Other App</option>
                    <option value="dont_trust_online">Don't Trust Online</option>
                    <option value="no_smartphone">No Smartphone</option>
                    <option value="price_too_high">Price Too High</option>
                    <option value="will_think">Will Think About It</option>
                    <option value="other">Other</option>
                  </>
                ) : (
                  <>
                    <option value="no_money_now">No Money Right Now</option>
                    <option value="wants_to_try_first">Wants to Try First</option>
                    <option value="fleet_owner_decides">Fleet Owner Decides</option>
                    <option value="price_too_high">Price Too High</option>
                    <option value="other">Other</option>
                  </>
                )}
              </select>
            )}

            {selected.requires.includes('language_noted') && (
              <select value={languageNoted} onChange={e => setLanguageNoted(e.target.value)}
                style={inputStyle}>
                <option value="">Driver's Language</option>
                <option value="tamil">Tamil</option>
                <option value="telugu">Telugu</option>
                <option value="kannada">Kannada</option>
                <option value="malayalam">Malayalam</option>
                <option value="bengali">Bengali</option>
                <option value="marathi">Marathi</option>
                <option value="gujarati">Gujarati</option>
                <option value="punjabi">Punjabi</option>
                <option value="odia">Odia</option>
                <option value="other">Other</option>
              </select>
            )}

            {/* Notes — always shown for connected dispositions */}
            <textarea
              placeholder="Notes (Hindi mein bhi likh sakte hain)..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit() || isSubmitting}
          style={{
            width: '100%',
            padding: '12px 0',
            borderRadius: 10,
            border: 'none',
            backgroundColor: canSubmit() ? '#111827' : '#D1D5DB',
            color: canSubmit() ? '#fff' : '#9CA3AF',
            fontSize: 15,
            fontWeight: 600,
            cursor: canSubmit() ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s ease',
          }}
        >
          {isSubmitting ? 'Saving...' : 'Save & Load Next Lead'}
        </button>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 8,
  border: '1px solid #D1D5DB',
  fontSize: 14,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};
