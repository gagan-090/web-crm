import React, { useState, useEffect } from 'react';
import { useSanCti } from './SanCtiContext';
import { useTriggerMockConversionMutation } from '../../../services/api/incentiveApi';
import { useAuth } from '../../../app/providers/AuthProvider';

interface PostCallDispositionModalProps {
  driverName?: string;
  driverTmid?: string;
  onDispositionComplete?: (result: any) => void;
}

const mmStages = [
  { value: '1', label: 'Stage 1: Profile Assessment' },
  { value: '2', label: 'Stage 2: Document Verification' },
  { value: '3', label: 'Stage 3: Interview Scheduled' },
  { value: '4', label: 'Stage 4: Trial Drive' },
  { value: '5', label: 'Stage 5: Background Check' },
  { value: '6', label: 'Stage 6: Job Offer Extended' },
  { value: '7', label: 'Stage 7: Offer Accepted' },
  { value: '8', label: 'Stage 8: Final Placement Confirmed' },
];


const rejectionReasons = [
  { value: 'already_have_loads', label: 'Already Have Loads' },
  { value: 'using_other_app', label: 'Using Other App' },
  { value: 'dont_trust_online', label: 'Don\'t Trust Online' },
  { value: 'no_smartphone', label: 'No Smartphone' },
  { value: 'price_too_high', label: 'Price Too High' },
  { value: 'will_think', label: 'Will Think About It' },
  { value: 'other', label: 'Other' },
];

const mmRejectionReasons = [
  { value: 'not_interested_in_location', label: 'Not Interested in Location' },
  { value: 'salary_too_low', label: 'Salary Too Low' },
  { value: 'already_employed', label: 'Already Employed' },
  { value: 'dont_like_transporter', label: 'Don\'t Like Transporter' },
  { value: 'other', label: 'Other' },
];

export const DWC_CONNECTED_OPTIONS = [
  'Agree for Subscription',
  'Agree for Subscription (Today)',
  'Agree for Subscription (Tomorrow)',
  'Already Subscribed',
  'App Issue',
  "Doesn't Understand App",
  'Driver - Cab | Bus',
  'Internet Issue - Low Speed',
  'Language Barrier',
  'Misbehave',
  'Need Load',
  'Needs Help in Profile',
  'Needs Job Urgently',
  'Neither Transporter nor Driver',
  'No Money',
  'Not Interested',
  'Ready for Interview',
  'Driver but Registered as Transporter',
  'Transporter but Registered as Driver',
  'Wants Demo Video',
  'Wants to Think Before Subscribing',
  'Will Subscribe Later (No specific time)',
  'Will Subscribe When Job Needed',
  'Subscription Done on Call',
  'Wrong Number',
  'Third Person Received - Asked to Call Later',
  'User Registering (Socail-Lead)',
  'Others',
];

export const DWC_NOT_CONNECTED_OPTIONS = [
  'Ringing - No Answer',
  'Switched Off',
  'Not Reachable',
  'Call Disconnected',
  'Number Busy',
];

export const DWC_CALLBACK_OPTIONS = [
  'Busy Right Now',
  'Call Tomorrow Morning',
  'Call In Evening',
  'Call After 2 Days',
];

export const isSubscriptionAgreeOption = (val: string) => {
  return [
    'Agree for Subscription',
    'Agree for Subscription (Today)',
    'Agree for Subscription (Tomorrow)',
    'Subscription Done on Call'
  ].includes(val);
};

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

  const { user } = useAuth();
  const [triggerMockConversion] = useTriggerMockConversionMutation();

  const activeName = driverName || currentLeadName || 'Unknown Lead';
  const activeTmid = driverTmid || currentLeadTmid || '';

  // Level 1 state
  const [level1, setLevel1] = useState<'connected' | 'not_connected' | 'callback_later' | ''>('');
  
  // Level 2 states
  const [level2Sub, setLevel2Sub] = useState<string>('');
  const [callbackSub, setCallbackSub] = useState<string>(''); // For connected -> callback later interval
  
  // Form fields
  const [notes, setNotes] = useState<string>('');
  const [callbackAt, setCallbackAt] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [planSelected, setPlanSelected] = useState<string>('');
  const [paymentId, setPaymentId] = useState<string>('');
  const [languageNoted, setLanguageNoted] = useState<string>('');
  const [feedbackStage, setFeedbackStage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // callDuration only ever counts up once SAN confirms Answer (or the mock-call
  // simulation), so > 0 here means the call definitely connected at some point
  // this session — even though SAN doesn't always reliably confirm Hangup too.
  const wasConnected = callDuration > 0;

  // Reset form when modal opens. Pre-select "Connected" when we already know
  // it connected — selecting "Not Connected" would just be factually wrong.
  useEffect(() => {
    if (showDispositionForm) {
      setLevel1(wasConnected ? 'connected' : '');
      setLevel2Sub('');
      setCallbackSub('');
      setNotes('');
      setCallbackAt('');
      setReason('');
      setPlanSelected('');
      setPaymentId('');
      setLanguageNoted('');
      setFeedbackStage('');
    }
  }, [showDispositionForm]);

  if (!showDispositionForm) return null;

  // Role detection
  const isDriverWelcome = user?.role?.includes('DW') || user?.role?.includes('Welcome');
  const isTransporterWelcome = user?.role?.includes('TW') || user?.role?.includes('Transporter');
  const isMatchmaking = user?.role?.includes('MM') || user?.role?.includes('Match');

  const getCalculatedCallbackTime = (interval: string): string => {
    const now = new Date();
    if (interval === 'tomorrow_morning' || interval === 'Call Tomorrow Morning') {
      const d = new Date(now);
      d.setDate(d.getDate() + 1);
      return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}T10:00`;
    }
    if (interval === 'tomorrow_evening' || interval === 'Call In Evening') {
      const d = new Date(now);
      if (d.getHours() >= 17) {
        d.setDate(d.getDate() + 1);
      }
      return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}T17:00`;
    }
    if (interval === 'two_days_morning' || interval === 'Call After 2 Days') {
      const d = new Date(now);
      d.setDate(d.getDate() + 2);
      return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}T10:00`;
    }
    if (interval === 'Busy Right Now') {
      const d = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
      return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}T${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
    }
    return '';
  };

  const canSubmit = () => {
    if (!level1) return false;
    if (!level2Sub) return false;

    if (level1 === 'connected') {
      if (!isDriverWelcome) {
        if (level2Sub === 'interested_callback') {
          if (!callbackSub) return false;
          if (callbackSub === 'custom' && !callbackAt) return false;
        }
        if (level2Sub === 'not_interested' || level2Sub === 'rejected') {
          if (!reason) return false;
        }
        if (level2Sub === 'language_barrier') {
          if (!languageNoted) return false;
        }
        if (level2Sub === 'placement_done') {
          if (!feedbackStage) return false;
        }
      }
    } else if (level1 === 'callback_later') {
      if (!isDriverWelcome) {
        if (level2Sub === 'custom' && !callbackAt) return false;
      }
    }
    return true;
  };

  const handleSubmit = async (loadNext: boolean | 'stay') => {
    if (!canSubmit() || isSubmitting) return;
    setIsSubmitting(true);

    let finalCallbackAt = null;
    let finalCallbackSub = null;

    if (level1 === 'callback_later') {
      finalCallbackSub = level2Sub;
      if (isDriverWelcome) {
        finalCallbackAt = getCalculatedCallbackTime(level2Sub);
      } else {
        if (level2Sub === 'custom') {
          finalCallbackAt = callbackAt;
        } else {
          finalCallbackAt = getCalculatedCallbackTime(level2Sub);
        }
      }
    } else if (level1 === 'connected' && !isDriverWelcome && level2Sub === 'interested_callback') {
      finalCallbackSub = callbackSub;
      if (callbackSub === 'custom') {
        finalCallbackAt = callbackAt;
      } else {
        finalCallbackAt = getCalculatedCallbackTime(callbackSub);
      }
    }

    try {
      const result = await submitDisposition({
        disposition: level1,
        notes: notes || null,
        callback_at: finalCallbackAt,
        callback_sub: finalCallbackSub,
        disposition_sub: level2Sub,
        plan_selected: planSelected || null,
        payment_id: paymentId || null,
        language_noted: languageNoted || null,
        feedback_stage: feedbackStage || null,
        reason: reason || null,
      });

      // Fire Incentive Engine mock conversion when appropriate
      const triggerMock = level1 === 'connected' && (
        isDriverWelcome ? isSubscriptionAgreeOption(level2Sub) :
        (level2Sub === 'agree_subscription' || level2Sub === 'agree_tr_subscription')
      );
      if (triggerMock && user?.role) {
        triggerMockConversion({
          role: user.role,
          planName: planSelected || 'Basic 199',
        });
      }

      if (onDispositionComplete) {
        onDispositionComplete({ ...result, loadNext });
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
        width: '95%',
        maxWidth: 520,
        maxHeight: '92vh',
        overflow: 'auto',
        padding: 24,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Header */}
        <div style={{ marginBottom: 20, borderBottom: '1px solid #F3F4F6', paddingBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#111827' }}>
            Call Ended — Log Disposition
          </h3>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6B7280', fontWeight: 500 }}>
            {activeName} {activeTmid ? `(${activeTmid})` : ''} — {formatDuration(callDuration)}
          </p>
        </div>

        {/* Level 1 Selection */}
        <div style={{ marginBottom: 20 }}>
          <div style={labelStyle}>Step 1: Call Outcome</div>
          {wasConnected && (
            <div style={{ fontSize: 11, color: '#10B981', fontWeight: 600, marginBottom: 8 }}>
              Call already connected — "Not Connected" is hidden.
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: wasConnected ? '1fr 1fr' : '1fr 1fr 1fr', gap: 10 }}>
            {[
              { id: 'connected', label: 'Connected', sub: 'कॉल जुड़ गया', color: '#10B981' },
              ...(wasConnected ? [] : [{ id: 'not_connected', label: 'Not Connected', sub: 'कॉल नहीं जुड़ा', color: '#EF4444' }]),
              { id: 'callback_later', label: 'Callback Later', sub: 'बाद में कॉल करें', color: '#3B82F6' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setLevel1(item.id as any);
                  setLevel2Sub('');
                  setCallbackSub('');
                }}
                style={{
                  padding: '12px 8px',
                  borderRadius: 12,
                  border: level1 === item.id ? `2px solid ${item.color}` : '1px solid #E5E7EB',
                  backgroundColor: level1 === item.id ? `${item.color}0A` : '#fff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1F2937' }}>{item.label}</div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{item.sub}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Level 2 Sub-Options based on Level 1 */}
        {level1 === 'not_connected' && (
          <div style={{ marginBottom: 20 }}>
            <div style={labelStyle}>Step 2: Reconnection State</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {isDriverWelcome ? (
                DWC_NOT_CONNECTED_OPTIONS.map(opt => (
                  <label
                    key={opt}
                    style={getRadioStyle(level2Sub === opt, '#EF4444')}
                  >
                    <input
                      type="radio"
                      name="level2Sub"
                      value={opt}
                      checked={level2Sub === opt}
                      onChange={() => setLevel2Sub(opt)}
                      style={{ accentColor: '#EF4444', marginRight: 8 }}
                    />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1F2937' }}>{opt}</div>
                    </div>
                  </label>
                ))
              ) : (
                [
                  { value: 'no_answer', label: 'No Answer / Ringing', label_hi: 'कॉल नहीं उठाया' },
                  { value: 'busy', label: 'Busy / Call Waiting', label_hi: 'व्यस्त है' },
                  { value: 'not_reachable', label: 'Not Reachable / Switched Off', label_hi: 'बंद/नेटवर्क से बाहर' },
                  { value: 'wrong_number', label: 'Wrong Number / Invalid', label_hi: 'गलत नंबर' },
                  { value: 'disconnected', label: 'Call Disconnected', label_hi: 'कॉल कट गया' }
                ].map(item => (
                  <label
                    key={item.value}
                    style={getRadioStyle(level2Sub === item.value, '#EF4444')}
                  >
                    <input
                      type="radio"
                      name="level2Sub"
                      value={item.value}
                      checked={level2Sub === item.value}
                      onChange={() => setLevel2Sub(item.value)}
                      style={{ accentColor: '#EF4444', marginRight: 8 }}
                    />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1F2937' }}>{item.label}</div>
                      <div style={{ fontSize: 10, color: '#9CA3AF' }}>{item.label_hi}</div>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        {level1 === 'callback_later' && (
          <div style={{ marginBottom: 20 }}>
            <div style={labelStyle}>Step 2: Callback Interval</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {isDriverWelcome ? (
                DWC_CALLBACK_OPTIONS.map(opt => (
                  <label
                    key={opt}
                    style={getRadioStyle(level2Sub === opt, '#3B82F6')}
                  >
                    <input
                      type="radio"
                      name="level2Sub"
                      value={opt}
                      checked={level2Sub === opt}
                      onChange={() => setLevel2Sub(opt)}
                      style={{ accentColor: '#3B82F6', marginRight: 8 }}
                    />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1F2937' }}>{opt}</div>
                    </div>
                  </label>
                ))
              ) : (
                [
                  { value: 'tomorrow_morning', label: 'Call Tomorrow Morning', label_hi: 'कल सुबह (10 AM)' },
                  { value: 'tomorrow_evening', label: 'Call Tomorrow Evening', label_hi: 'कल शाम (5 PM)' },
                  { value: 'two_days_morning', label: 'Call in 2 Days', label_hi: '2 दिन बाद (10 AM)' },
                  { value: 'custom', label: 'Custom Date & Time', label_hi: 'कस्टम समय चुनें' }
                ].map(item => (
                  <label
                    key={item.value}
                    style={getRadioStyle(level2Sub === item.value, '#3B82F6')}
                  >
                    <input
                      type="radio"
                      name="level2Sub"
                      value={item.value}
                      checked={level2Sub === item.value}
                      onChange={() => setLevel2Sub(item.value)}
                      style={{ accentColor: '#3B82F6', marginRight: 8 }}
                    />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#1F2937' }}>{item.label}</div>
                      <div style={{ fontSize: 10, color: '#9CA3AF' }}>{item.label_hi}</div>
                    </div>
                  </label>
                ))
              )}
            </div>
            {!isDriverWelcome && level2Sub === 'custom' && (
              <div style={{ marginTop: 12 }}>
                <input
                  type="datetime-local"
                  value={callbackAt}
                  onChange={e => setCallbackAt(e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}
          </div>
        )}

        {level1 === 'connected' && (
          <div style={{ marginBottom: 20 }}>
            <div style={labelStyle}>Step 2: Connected Outcome</div>
            {isDriverWelcome ? (
              <div style={{ width: '100%' }}>
                <select
                  value={level2Sub}
                  onChange={e => setLevel2Sub(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">-- Choose Connected Feedback Option --</option>
                  {DWC_CONNECTED_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {/* Fallback for general Connected welcome-call process */}
                {(!isTransporterWelcome && !isMatchmaking) && (
                  <>
                    {[
                      { value: 'agree_subscription', label: 'Agree for Subscription Today', label_hi: 'आज पेमेंट करेंगे' },
                      { value: 'interested_callback', label: 'Interested - Callback Later', label_hi: 'रुचि है, बाद में करेंगे' },
                      { value: 'not_interested', label: 'Not Interested', label_hi: 'रुचि नहीं है' },
                      { value: 'already_subscribed', label: 'Already Subscribed', label_hi: 'पहले से सब्सक्राइब्ड है' },
                      { value: 'language_barrier', label: 'Language Barrier', label_hi: 'भाषा की समस्या' }
                    ].map(item => (
                      <label
                        key={item.value}
                        style={getRadioStyle(level2Sub === item.value, '#10B981')}
                      >
                        <input
                          type="radio"
                          name="level2Sub"
                          value={item.value}
                          checked={level2Sub === item.value}
                          onChange={() => setLevel2Sub(item.value)}
                          style={{ accentColor: '#10B981', marginRight: 8 }}
                        />
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#1F2937' }}>{item.label}</div>
                          <div style={{ fontSize: 10, color: '#9CA3AF' }}>{item.label_hi}</div>
                        </div>
                      </label>
                    ))}
                  </>
                )}

                {/* Render options for Transporter Welcome */}
                {isTransporterWelcome && (
                  <>
                    {[
                      { value: 'agree_tr_subscription', label: 'Agree for Subscription Today', label_hi: 'आज पेमेंट करेंगे' },
                      { value: 'interested_callback', label: 'Interested - Callback Later', label_hi: 'रुचि है, बाद में करेंगे' },
                      { value: 'not_interested', label: 'Not Interested', label_hi: 'रुचि नहीं है' },
                      { value: 'already_subscribed', label: 'Already Subscribed', label_hi: 'पहले से सब्सक्राइब्ड है' }
                    ].map(item => (
                      <label
                        key={item.value}
                        style={getRadioStyle(level2Sub === item.value, '#10B981')}
                      >
                        <input
                          type="radio"
                          name="level2Sub"
                          value={item.value}
                          checked={level2Sub === item.value}
                          onChange={() => setLevel2Sub(item.value)}
                          style={{ accentColor: '#10B981', marginRight: 8 }}
                        />
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#1F2937' }}>{item.label}</div>
                          <div style={{ fontSize: 10, color: '#9CA3AF' }}>{item.label_hi}</div>
                        </div>
                      </label>
                    ))}
                  </>
                )}

                {/* Render options for Matchmaking */}
                {isMatchmaking && (
                  <>
                    {[
                      { value: 'placement_done', label: 'Driver Placement Done', label_hi: 'ड्राइवर प्लेसमेंट हो गया' },
                      { value: 'callback', label: 'Call Back Later', label_hi: 'बाद में कॉल करें' },
                      { value: 'rejected', label: 'Rejected by Driver/Transporter', label_hi: 'रिजेक्ट हो गया' }
                    ].map(item => (
                      <label
                        key={item.value}
                        style={getRadioStyle(level2Sub === item.value, '#10B981')}
                      >
                        <input
                          type="radio"
                          name="level2Sub"
                          value={item.value}
                          checked={level2Sub === item.value}
                          onChange={() => setLevel2Sub(item.value)}
                          style={{ accentColor: '#10B981', marginRight: 8 }}
                        />
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#1F2937' }}>{item.label}</div>
                          <div style={{ fontSize: 10, color: '#9CA3AF' }}>{item.label_hi}</div>
                        </div>
                      </label>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Level 3 conditional inputs based on selected Connected Outcome */}
        {level1 === 'connected' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            


            {/* Callback Requested Flow */}
            {(!isDriverWelcome && level2Sub === 'interested_callback') && (
              <>
                <div>
                  <label style={subLabelStyle}>Callback Schedule Interval *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { value: 'tomorrow_morning', label: 'Tomorrow Morning', label_hi: 'कल सुबह (10 AM)' },
                      { value: 'tomorrow_evening', label: 'Tomorrow Evening', label_hi: 'कल शाम (5 PM)' },
                      { value: 'two_days_morning', label: 'In 2 Days', label_hi: '2 दिन बाद (10 AM)' },
                      { value: 'custom', label: 'Custom Date & Time', label_hi: 'कस्टम समय चुनें' }
                    ].map(item => (
                      <label
                        key={item.value}
                        style={getRadioStyle(callbackSub === item.value, '#3B82F6')}
                      >
                        <input
                          type="radio"
                          name="callbackSub"
                          value={item.value}
                          checked={callbackSub === item.value}
                          onChange={() => setCallbackSub(item.value)}
                          style={{ accentColor: '#3B82F6', marginRight: 8 }}
                        />
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: '#1F2937' }}>{item.label}</div>
                          <div style={{ fontSize: 9, color: '#9CA3AF' }}>{item.label_hi}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                {callbackSub === 'custom' && (
                  <div>
                    <label style={subLabelStyle}>Select Custom Date & Time *</label>
                    <input
                      type="datetime-local"
                      value={callbackAt}
                      onChange={e => setCallbackAt(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                )}
              </>
            )}

            {/* Rejection / Not Interested Flow */}
            {(!isDriverWelcome && (level2Sub === 'not_interested' || level2Sub === 'rejected')) && (
              <div>
                <label style={subLabelStyle}>Reason for rejection *</label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Select a reason...</option>
                  {isMatchmaking 
                    ? mmRejectionReasons.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))
                    : rejectionReasons.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))
                  }
                </select>
              </div>
            )}

            {/* Language Barrier Flow */}
            {(!isDriverWelcome && level2Sub === 'language_barrier') && (
              <div>
                <label style={subLabelStyle}>Select Language Noted *</label>
                <select
                  value={languageNoted}
                  onChange={e => setLanguageNoted(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Select driver's language...</option>
                  <option value="tamil">Tamil (தமிழ்)</option>
                  <option value="telugu">Telugu (తెలుగు)</option>
                  <option value="kannada">Kannada (ಕನ್ನಡ)</option>
                  <option value="malayalam">Malayalam (മലയാളം)</option>
                  <option value="bengali">Bengali (বাংলা)</option>
                  <option value="marathi">Marathi (मराठी)</option>
                  <option value="gujarati">Gujarati (ગુજરાતી)</option>
                  <option value="punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                  <option value="odia">Odia (ଓଡ଼ିଆ)</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}

            {/* Matchmaking Placement Done Flow */}
            {level2Sub === 'placement_done' && (
              <div>
                <label style={subLabelStyle}>Verify Placement Stage *</label>
                <select
                  value={feedbackStage}
                  onChange={e => setFeedbackStage(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Choose placement stage...</option>
                  {mmStages.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Notes (Render for any selection once Level 2 sub-option is picked) */}
        {level2Sub && (
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Step 3: Call Remarks</label>
            <textarea
              placeholder="Enter remarks/notes (Hindi mein bhi likh sakte hain)..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16, borderTop: '1px solid #F3F4F6', paddingTop: 16 }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => handleSubmit('stay')}
              disabled={!canSubmit() || isSubmitting}
              style={{
                flex: 1,
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid #D1D5DB',
                backgroundColor: '#fff',
                color: canSubmit() ? '#374151' : '#9CA3AF',
                fontSize: 13,
                fontWeight: 600,
                cursor: canSubmit() ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s ease',
              }}
            >
              Save & Stay on Lead
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={!canSubmit() || isSubmitting}
              style={{
                flex: 1,
                padding: '12px 14px',
                borderRadius: 10,
                border: '1px solid #D1D5DB',
                backgroundColor: '#fff',
                color: canSubmit() ? '#374151' : '#9CA3AF',
                fontSize: 13,
                fontWeight: 600,
                cursor: canSubmit() ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s ease',
              }}
            >
              {isSubmitting ? 'Saving...' : 'Save & Close'}
            </button>
          </div>
          
          <button
            onClick={() => handleSubmit(true)}
            disabled={!canSubmit() || isSubmitting}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 10,
              border: 'none',
              backgroundColor: canSubmit() ? '#111827' : '#D1D5DB',
              color: canSubmit() ? '#fff' : '#9CA3AF',
              fontSize: 13,
              fontWeight: 600,
              cursor: canSubmit() ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s ease',
            }}
          >
            {isSubmitting ? 'Saving...' : 'Save & Load Next Lead'}
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: '#4B5563',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 8,
};

const subLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: '#6B7280',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #D1D5DB',
  fontSize: 13,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  outline: 'none',
};

const getRadioStyle = (selected: boolean, color: string): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 12px',
  borderRadius: 10,
  border: selected ? `2px solid ${color}` : '1px solid #E5E7EB',
  cursor: 'pointer',
  backgroundColor: selected ? `${color}08` : '#fff',
  transition: 'all 0.15s ease',
});
