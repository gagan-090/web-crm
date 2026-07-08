import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSubmitCtiFeedbackMutation } from '../../services/api/ctiApi';

const DWC_CONNECTED_OPTIONS = [
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

const DWC_NOT_CONNECTED_OPTIONS = [
  'Ringing - No Answer',
  'Switched Off',
  'Not Reachable',
  'Call Disconnected',
  'Number Busy',
];

const DWC_CALLBACK_OPTIONS = [
  'Busy Right Now',
  'Call Tomorrow Morning',
  'Call In Evening',
  'Call After 2 Days',
];
import {
  useGetDwLeadDetailQuery,
  useLazyGetDwNextLeadQuery,
  useLazyGetDwQueueFreshQuery,
  useLazyGetDwQueueOldQuery,
  useLazyGetDwQueueUncalledQuery,
  useLazyGetDwQueueCallbacksQuery,
  useLazyGetDwQueueCalledQuery,
  useLazyGetDwCampaignLeadsQuery,
  useSubmitDwFeedbackMutation,
  useSkipDwLeadMutation
} from '../../services/api/webCrmApi';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';
import { useAuth } from '../../app/providers/AuthProvider';
import { invalidateQueueCache, useQueueCache } from '../../shared/hooks/useQueueCache';
import type { QueueType } from '../../shared/hooks/useQueueCache';

interface Objection {
  key: string;
  question: string;
  answer: string;
}

export const DwActiveCallFocus: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isDriverWelcome = user?.role?.includes('DW') || user?.role?.includes('Welcome');
  const isTransporterWelcome = user?.role?.includes('TW') || user?.role?.includes('Transporter');
  const isMatchmaking = user?.role?.includes('MM') || user?.role?.includes('Match');

  const {
    dial,
    hangup,
    callState,
    agentState,
    callDuration,
    isMuted: liveMuted,
    isHeld: liveHeld,
    toggleMute: toggleLiveMute,
    toggleHold: toggleLiveHold,
    isIncomingCall,
    currentLeadName: incomingLeadName,
    currentPhoneNumber: incomingPhone,
    currentLeadId: incomingLeadId,
    currentLeadLocation: incomingLeadLocation,
    currentLeadCallStatus: incomingLeadCallStatus,
  } = useSanCti();

  const [submitCtiFeedback] = useSubmitCtiFeedbackMutation();
  const [submitDwFeedback] = useSubmitDwFeedbackMutation();
  const [skipDwLead] = useSkipDwLeadMutation();

  const [ivrCallId] = useState<number | null>(null);

  // Active Lead ID state (starts from navigation state or empty)
  const stateLead = location.state || {};
  const [userId, setUserId] = useState<number | string>(stateLead.userId || '');

  // ── Section dialing batch ──
  // When the agent clicks "Call Now" from a specific queue tab, the whole
  // currently-loaded page of that tab travels here as a batch, so they can
  // dial through every lead in that section without ever going back to the
  // queue screen between calls. queueType is undefined for entry points that
  // don't carry section context (e.g. an incoming call) — in that case we
  // fall back to the generic "any next lead" picker, same as before.
  const [batch, setBatch] = useState<any[]>(stateLead.queueBatch || []);
  const [batchPos, setBatchPos] = useState<number>(stateLead.batchIndex ?? 0);
  const [queueType, setQueueType] = useState<string | undefined>(stateLead.queueType);
  const [queuePage, setQueuePage] = useState<number>(stateLead.queuePage || 1);
  const queueFiltersRef = React.useRef(stateLead.queueFilters || {});
  const currentBatchLead = queueType && batch[batchPos] ? batch[batchPos] : null;

  // Next Lead Query (lazy to allow fresh cache bypass) — generic fallback only
  const [triggerNextLead, { isLoading: nextLeadLoading }] = useLazyGetDwNextLeadQuery();

  // Lazy triggers to pull the next page of the SAME section once the batch runs out
  const [triggerFreshPage] = useLazyGetDwQueueFreshQuery();
  const [triggerOldPage] = useLazyGetDwQueueOldQuery();
  const [triggerUncalledPage] = useLazyGetDwQueueUncalledQuery();
  const [triggerCallbacksPage] = useLazyGetDwQueueCallbacksQuery();
  const [triggerCalledPage] = useLazyGetDwQueueCalledQuery();
  const [triggerCampaignLeads] = useLazyGetDwCampaignLeadsQuery();

  const fetchNextSectionPage = async (): Promise<any[]> => {
    if (!queueType) return [];
    const nextPage = queuePage + 1;
    const params = { page: nextPage, per_page: 20, ...queueFiltersRef.current };
    let result: any;
    if (queueType === 'fresh') result = await triggerFreshPage(params).unwrap();
    else if (queueType === 'old') result = await triggerOldPage(params).unwrap();
    else if (queueType === 'uncalled') result = await triggerUncalledPage(params).unwrap();
    else if (queueType === 'callbacks') result = await triggerCallbacksPage(params).unwrap();
    else if (queueType === 'called') result = await triggerCalledPage(params).unwrap();
    else if (queueType === 'campaign') result = await triggerCampaignLeads({ page: nextPage, source: queueFiltersRef.current?.source === 'ALL' ? undefined : queueFiltersRef.current?.source }).unwrap();
    else return [];
    setQueuePage(nextPage);
    const leads = result?.data?.data || result?.data?.leads || result?.leads || (Array.isArray(result?.data) ? result.data : []);
    return leads;
  };

  const loadNextLead = async () => {
    if (queueType) {
      // Stay inside the section the agent started dialing from.
      const nextPos = batchPos + 1;
      if (nextPos < batch.length) {
        setBatchPos(nextPos);
        setUserId(batch[nextPos].id);
        return;
      }
      try {
        const nextLeads = await fetchNextSectionPage();
        if (nextLeads.length > 0) {
          setBatch(nextLeads);
          setBatchPos(0);
          setUserId(nextLeads[0].id);
          return;
        }
      } catch (err) {
        triggerToast('Failed to load the next lead in this section.');
        return;
      }
      // Section genuinely exhausted.
      setUserId('');
      setQueueType(undefined);
      triggerToast('No more leads in this section.');
      navigate(stateLead.isCampaign ? '/dw/dw-campaign-leads' : '/dw/dw-call-queue');
      return;
    }
 
    // No section context (e.g. incoming call) — generic "any next lead" picker.
    try {
      if (stateLead.isCampaign) {
        setUserId('');
        triggerToast('No more campaign leads in the queue.');
        navigate('/dw/dw-campaign-leads');
        return;
      }
      const result = await triggerNextLead(undefined, true).unwrap();
      if (result?.data) {
        setUserId(result.data.id);
      } else {
        setUserId('');
        triggerToast('No more leads in the queue.');
        navigate('/dw/dw-call-queue');
      }
    } catch (err) {
      triggerToast('Failed to load the next lead.');
    }
  };

  useEffect(() => {
    // Skip auto-loading next lead when navigated here for an incoming call
    if (stateLead.incomingCall) return;
    if (!userId) {
      loadNextLead();
    }
  }, []);

  // When an incoming caller's DB record resolves, switch userId to their ID
  useEffect(() => {
    if (isIncomingCall && incomingLeadId && (callState === 'incoming_ringing' || callState === 'connected')) {
      setUserId(incomingLeadId);
      lastDialedUserId.current = incomingLeadId;
    }
  }, [isIncomingCall, incomingLeadId, callState]);

  // Fetch driver profile details from database
  const { data: detailResponse, isLoading: profileLoading, refetch: refetchDetail } = useGetDwLeadDetailQuery(userId, {
    skip: !userId
  });

  const driverProfile = detailResponse?.data?.profile;
  const planCard = detailResponse?.data?.plan_card;

  // currentBatchLead covers leads 2+ in the section batch — stateLead only ever
  // describes the very first lead the agent clicked, so without this fallback
  // every subsequent lead would briefly (or permanently, on a slow API) show
  // the first lead's name/phone/tmid instead of its own.
  const leadName = driverProfile?.name || currentBatchLead?.name || stateLead.name || 'No Active Lead';
  const leadTmid = driverProfile?.tmid || currentBatchLead?.tmid || stateLead.tmid || 'DR-00000';
  const leadPhone = driverProfile?.mobile || currentBatchLead?.mobile || currentBatchLead?.phone || stateLead.mobile || '00000 00000';
  const leadLocation = driverProfile
    ? `${driverProfile.city}, ${driverProfile.state}`
    : currentBatchLead?.city
      ? `${currentBatchLead.city}, ${currentBatchLead.state || ''}`
      : stateLead.location || 'Unknown';

  // Timer state
  const [seconds, setSeconds] = useState(0);

  const [activeTab, setActiveTab] = useState<string>('profile');

  // Auto-switch to profile tab on incoming call ringing or connected
  useEffect(() => {
    if (isIncomingCall && (callState === 'incoming_ringing' || callState === 'connected')) {
      setActiveTab('profile');
    }
  }, [isIncomingCall, callState]);

  // Note state
  const [quickNote, setQuickNote] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);

  // Search & objections
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Post-Call Form Modal States
  const [showPostCallModal, setShowPostCallModal] = useState(false);
  const [outcome, setOutcome] = useState<'connected' | 'not_connected' | 'callback_later' | ''>('');

  // Post-Call details
  const [level2Sub, setLevel2Sub] = useState<string>('');
  const [callbackSub, setCallbackSub] = useState<string>('');
  const [languageNoted, setLanguageNoted] = useState<string>('');
  const [feedbackStage, setFeedbackStage] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [callbackAt, setCallbackAt] = useState<string>('');
  const [dispositionNotes, setDispositionNotes] = useState('');

  // WhatsApp Payment Link Modal States
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Job Ready ₹199');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Right sidebar: when dialing through a section batch, show the rest of
  // that same batch (so the agent can see/skip ahead within their section);
  // otherwise fall back to the generic Fresh leads list.
  const fallbackTab = (sessionStorage.getItem('dw_queue_tab') as QueueType) || 'all';
  const { data: queueCache } = useQueueCache(fallbackTab, { page: 1, search: '', per_page: 15 });
  const nextLeads = queueType ? batch.slice(batchPos) : (queueCache?.leads || []);

  // Ref to prevent dialing the same user during transition states
  const lastDialedUserId = React.useRef<string | number | null>(
    (stateLead.userId && (callState === 'dialing' || callState === 'ringing' || callState === 'connected' || callState === 'disposition_pending'))
      ? stateLead.userId
      : null
  );

  // Listen for global disposition modal completion
  useEffect(() => {
    const handleComplete = (e: Event) => {
      const customEvent = e as CustomEvent;
      const loadNext = customEvent.detail?.loadNext ?? true;
      if (loadNext === true) {
        setSeconds(0);
        loadNextLead();
      } else if (loadNext === 'stay') {
        refetchDetail();
      } else {
        setTimeout(() => {
          navigate(stateLead.isCampaign ? '/dw/dw-campaign-leads' : '/dw/dw-call-queue');
        }, 500);
      }
    };
    window.addEventListener('san-disposition-complete', handleComplete);
    return () => window.removeEventListener('san-disposition-complete', handleComplete);
  // loadNextLead must be included: it now closes over batch/batchPos/queueType,
  // which change as the agent progresses through a section. Without it here,
  // this listener would keep calling a version of loadNextLead frozen at
  // whatever the batch looked like on mount.
  }, [navigate, refetchDetail, loadNextLead]);

  // The auto-dial useEffect has been removed to stop instantaneous dialing when focusing on a lead.
  // The agent will now manually click 'Dial Lead Call' to initiate the call.

  const formatTimer = (secCount: number) => {
    const mins = Math.floor(secCount / 60);
    const secs = secCount % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendPaymentLink = () => {
    triggerToast(`Payment link sent to ${leadName} via WhatsApp ✓`);
    setShowLinkModal(false);
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuickNote(e.target.value);
    setNoteSaving(true);
  };

  useEffect(() => {
    if (quickNote) {
      const delayDebounceFn = setTimeout(() => {
        setNoteSaving(false);
      }, 1000);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [quickNote]);

  const handleSkipLead = async () => {
    if (!userId) return;
    const reasonText = prompt('Please enter a skip reason:');
    if (!reasonText) return;
    try {
      await skipDwLead({
        user_id: Number(userId),
        reason: reasonText
      }).unwrap();
      triggerToast('Lead skipped.');
      navigate('/dw/dw-call-queue');
    } catch (err) {
      triggerToast('Failed to skip lead.');
    }
  };

  const getCalculatedCallbackTime = (interval: string): string => {
    const now = new Date();
    if (interval === 'tomorrow_morning' || interval === 'Call Tomorrow Morning') {
      const d = new Date(now);
      d.setDate(d.getDate() + 1);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}T10:00`;
    }
    if (interval === 'tomorrow_evening' || interval === 'Call In Evening') {
      const d = new Date(now);
      if (d.getHours() >= 17) {
        d.setDate(d.getDate() + 1);
      }
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}T17:00`;
    }
    if (interval === 'two_days_morning' || interval === 'Call After 2 Days') {
      const d = new Date(now);
      d.setDate(d.getDate() + 2);
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}T10:00`;
    }
    if (interval === 'Busy Right Now') {
      const d = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
      return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}T${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    }
    return '';
  };

  const canSubmit = () => {
    if (!outcome) return false;
    if (!level2Sub) return false;

    if (outcome === 'connected') {
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
    } else if (outcome === 'callback_later') {
      if (!isDriverWelcome) {
        if (level2Sub === 'custom' && !callbackAt) return false;
      }
    }
    return true;
  };

  // Submit post call disposition
  const handleDispositionSubmit = async (loadNext: boolean | 'stay') => {
    if (!userId || !canSubmit()) return;

    let ctiStatus = 'FAILED';
    if (outcome === 'connected') ctiStatus = 'ANSWER';
    else if (outcome === 'not_connected') ctiStatus = 'NO_ANSWER';
    else if (outcome === 'callback_later') ctiStatus = 'CALLBACK';

    let dbFeedback = '';
    if (outcome === 'not_connected') {
      dbFeedback = level2Sub;
    } else if (outcome === 'callback_later') {
      dbFeedback = 'Call Back Later';
    } else if (outcome === 'connected') {
      dbFeedback = level2Sub;
    }

    let finalCallbackAt = null;
    let finalCallbackSub = null;

    if (outcome === 'callback_later') {
      finalCallbackSub = level2Sub;
      finalCallbackAt = getCalculatedCallbackTime(level2Sub);
    } else if (outcome === 'connected' && !isDriverWelcome && level2Sub === 'interested_callback') {
      finalCallbackSub = callbackSub;
      if (callbackSub === 'custom') {
        finalCallbackAt = callbackAt;
      } else {
        finalCallbackAt = getCalculatedCallbackTime(callbackSub);
      }
    }

    try {
      // 1. Submit feedback to DWC CRM table
      await submitDwFeedback({
        user_id: Number(userId),
        call_status: (outcome === 'callback_later' || (outcome === 'connected' && isDriverWelcome && level2Sub.includes('Call')) || level2Sub === 'interested_callback' || level2Sub === 'callback') ? 'callback_later' : outcome,
        call_feedback: dbFeedback,
        call_remarks: dispositionNotes || `Logged active call duration ${formatTimer(seconds)}`,
        call_duration: seconds,
        call_id: ivrCallId || undefined,
        disposition_sub: level2Sub || null,
        callback_sub: finalCallbackSub || null,
        callback_at: finalCallbackAt || null,
        plan_selected: null,
        payment_id: null,
        language_noted: languageNoted || null,
        feedback_stage: feedbackStage || null,
      }).unwrap();

      // 2. Submit CTI feedback sync
      if (ivrCallId) {
        await submitCtiFeedback({
          id: ivrCallId,
          call_status: ctiStatus,
          call_feedback: dbFeedback,
          call_remarks: dispositionNotes || 'Logged from softphone'
        }).unwrap();
      }

      // Drop cached queue/uncalled/old lists so this lead's new call_history_ivr
      // row is reflected next time the agent views the queue, instead of the
      // stale cached list still showing them as not-yet-called.
      invalidateQueueCache();

      triggerToast('Call disposition saved successfully ✓');
      setShowPostCallModal(false);

      if (loadNext === true) {
        setSeconds(0);
        loadNextLead();
      } else if (loadNext === 'stay') {
        refetchDetail();
      } else {
        setTimeout(() => {
          navigate('/dw/dw-call-queue');
        }, 500);
      }

    } catch (err) {
      console.error('[API] Failed to submit disposition:', err);
      triggerToast('Failed to save disposition.');
    }
  };


  // Hindi objections data
  const objections: Objection[] = [
    { key: 'paisa', question: 'पैसे नहीं हैं', answer: 'राजेश जी, यह एक छोटा निवेश है जो आपके व्यवसाय को कई गुना बढ़ा देगा। केवल ₹199 या ₹299 के निवेश से आपको तुरंत लोड बुकिंग मिलना शुरू हो जाएगी और आप पहले ही दिन अपनी लागत निकाल लेंगे।' },
    { key: 'job', question: 'पहले कोई जॉब नहीं मिली', answer: 'हम समझते हैं राजेश जी, लेकिन ट्रक मित्र पर 50,000 से अधिक ड्राइवर्स रोजाना लोड पा रहे हैं। हमारी टीम आपको पहला लोड बुक कराने में खुद मदद करेगी।' },
    { key: 'baad', question: 'सोचता हूँ, बाद में करूंगा', answer: 'राजेश जी, अभी ऑफर्स चल रहे हैं और कई ट्रांसपोर्टर्स तुरंत ड्राइवर्स ढूंढ रहे हैं। अगर आप अभी शुरू करते हैं तो आज ही काम मिलना आसान रहेगा।' },
    { key: 'fraud', question: 'यह सब fraud है', answer: 'विश्वास रखिए राजेश जी, हम पूरी तरह से सरकारी मान्यता प्राप्त हैं और हमारे पास 50,000+ ड्राइवर्स का नेटवर्क है। आप चाहें तो पहले कम राशि का ₹199 का प्लान लेकर स्वयं जांच सकते हैं।' },
    { key: 'delete', question: 'App delete कर दी', answer: 'कोई बात नहीं राजेश जी, मैं आपके व्हाट्सएप पर डायरेक्ट ऐप का डाउनलोड लिंक और वीडियो भेज रहा हूँ। उसे देखकर आप 2 मिनट में दोबारा इंस्टॉल कर सकते हैं।' },
    { key: 'gaadi', question: 'ट्रक नहीं है / खुद गाड़ी नहीं है', answer: 'राजेश जी, हमारे पास ऐसे भी ट्रांसपोर्टर्स हैं जो बिना गाड़ी वाले ड्राइवर्स को सीधे मंथली सैलरी पर जॉब दे रहे हैं। हम आपको वैसी ही नौकरियों के लिए सजेस्ट करेंगे।' }
  ];

  const toggleBookmark = (key: string) => {
    setBookmarks(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const getSortedObjections = () => {
    let list = [...objections];
    if (searchQuery) {
      list = list.filter(obj =>
        obj.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obj.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obj.key.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    list.sort((a, b) => {
      const aBook = bookmarks.includes(a.key) ? 1 : 0;
      const bBook = bookmarks.includes(b.key) ? 1 : 0;
      return bBook - aBook;
    });
    return list;
  };

  const sortedObjections = getSortedObjections();

  if (profileLoading || nextLeadLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <p className="text-sm font-semibold text-outline">Loading active call dialer...</p>
      </div>
    );
  }

  return (
    <main className="h-[calc(100vh-80px)] flex bg-white overflow-hidden border border-gray-200 rounded-xl relative">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#27AE60]"></span>
          {toastMessage}
        </div>
      )}

      {/* LEFT COLUMN: Controls & Call Context */}
      <section className="w-[380px] border-r border-gray-200 flex flex-col p-5 bg-gray-50/50 shrink-0 overflow-y-auto">

        {/* Top Strip */}
        <div className="bg-white border border-gray-200 p-3 rounded-xl shadow-sm mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${callState === 'connected' ? 'bg-green-600 animate-pulse' :
                  callState === 'ringing' || callState === 'dialing' ? 'bg-amber-500 animate-ping' :
                    callState === 'incoming_ringing' ? 'bg-blue-500 animate-ping' :
                        'bg-gray-400'
                }`}></span>
              <span className="font-mono text-xl font-bold text-gray-800">
                {formatTimer(callState !== 'idle' ? callDuration : 0)}
              </span>
              {callState === 'incoming_ringing' && (
                <span className="text-[10px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                  INCOMING CALL
                </span>
              )}
            </div>

            {/* Audio Toggles */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => { toggleLiveMute(); triggerToast(liveMuted ? 'Microphone active' : 'Microphone muted'); }}
                className={`p-1.5 rounded-lg border text-xs flex items-center justify-center transition-all ${liveMuted ? 'bg-red-50 border-red-200 text-red-600 font-bold' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                title="Mute"
              >
                <span className="material-symbols-outlined text-[18px]">{liveMuted ? 'mic_off' : 'mic'}</span>
              </button>
              <button
                onClick={() => { toggleLiveHold(); triggerToast(liveHeld ? 'Call resumed' : 'Call on hold'); }}
                className={`p-1.5 rounded-lg border text-xs flex items-center justify-center transition-all ${liveHeld ? 'bg-amber-50 border-amber-200 text-amber-600 font-bold' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                title="Hold"
              >
                <span className="material-symbols-outlined text-[18px]">{liveHeld ? 'play_arrow' : 'pause'}</span>
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-2 font-semibold">
            {isIncomingCall && callState !== 'idle' ? (
              <>
                <span className="text-blue-600 font-bold">📲 Incoming:</span>
                {' '}<span className="text-gray-800">{incomingLeadName || 'Unknown Caller'}</span>
                {' '}·{' '}<span className="font-mono">{incomingPhone}</span>
                {incomingLeadLocation ? <>{' '}· <span className="text-gray-600">{incomingLeadLocation}</span></> : null}
                {incomingLeadCallStatus ? <>{' '}· <span className={`font-bold ${incomingLeadCallStatus === 'done' ? 'text-green-600' : 'text-amber-600'}`}>{incomingLeadCallStatus}</span></> : null}
              </>
            ) : (
              <>Active: <span className="text-gray-800">{leadName}</span> · <span className="font-mono">{leadTmid}</span> · <span className="text-gray-600">{leadPhone}</span> · <span className="text-gray-600">{leadLocation}</span></>
            )}
          </div>
        </div>

        {/* ── INCOMING CALLER PROFILE CARD ── */}
        {isIncomingCall && (callState === 'incoming_ringing' || callState === 'connected') && (
          <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-4 mb-4 animate-pulse-once">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping shrink-0"></span>
              <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-widest">
                {callState === 'incoming_ringing' ? '📲 Incoming Call — Ringing' : '📞 Incoming Call — Connected'}
              </span>
            </div>

            {incomingLeadName && incomingLeadName !== 'Incoming Call' ? (
              <div className="space-y-2">
                {/* Name + TMID */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-gray-900">{incomingLeadName}</span>
                  {incomingLeadLocation && (
                    <span className="text-[10px] text-blue-700 font-bold bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full">
                      {incomingLeadLocation}
                    </span>
                  )}
                </div>

                {/* Phone */}
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className="material-symbols-outlined text-[14px] text-blue-500">call</span>
                  <span className="font-mono font-semibold">{incomingPhone}</span>
                </div>

                {/* Call History Status */}
                {incomingLeadCallStatus && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="material-symbols-outlined text-[14px] text-gray-400">history</span>
                    <span className="text-gray-500">Previous call status:</span>
                    <span className={`font-bold capitalize ${
                      incomingLeadCallStatus === 'done' ? 'text-green-600' :
                      incomingLeadCallStatus === 'pending' ? 'text-amber-600' :
                      incomingLeadCallStatus === 'callback_later' ? 'text-blue-600' :
                      'text-gray-700'
                    }`}>
                      {incomingLeadCallStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* Number not found in DB */
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className="material-symbols-outlined text-[14px] text-blue-500">call</span>
                  <span className="font-mono font-bold text-gray-800">{incomingPhone || 'Unknown Number'}</span>
                </div>
                <p className="text-[10px] text-gray-400 italic">
                  {incomingLeadName === 'Incoming Call'
                    ? 'Looking up caller details...'
                    : 'Number not found in the user database.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Current Subscription Status */}
        {planCard?.has_plan && (
          <div className="bg-[#EAFAF1] border border-[#27AE60]/20 rounded-xl p-3 mb-4 text-xs font-bold text-[#27AE60]">
            ✓ Driver Subscribed: {planCard.plan_label} (Expires: {planCard.expires_at})
          </div>
        )}

        {/* Plan price reference card */}
        <div className="bg-[#FFF9E6] border border-[#F39C12] rounded-xl p-4 mb-4 select-none">
          <div className="text-xs font-bold text-[#D35400] mb-2 uppercase tracking-wide">
            📌 CURRENT PLANS
          </div>
          <div className="space-y-1.5 text-xs text-[#7F8C8D]">
            <div className="flex justify-between">
              <span className="font-medium text-[#2C3E50]">Job Ready Plan</span>
              <span className="font-mono font-bold text-[#D35400]">₹199 / 1 year</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-[#2C3E50]">Verified Plan</span>
              <span className="font-mono font-bold text-[#D35400]">₹299 / 1 year</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-[#2C3E50]">Trusted Plan</span>
              <span className="font-mono font-bold text-[#D35400]">₹499 / 1 year</span>
            </div>
          </div>
        </div>

        {/* Pre-disposition selection triggers outcome modal */}
        <div className="mb-4">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Quick Pre-Disposition</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'connected', label: 'Connected', icon: 'check_circle' },
              { id: 'not_connected', label: 'No Answer / NR', icon: 'phone_disabled' },
              { id: 'callback_later', label: 'Callback Later', icon: 'timer' }
            ].map(disp => (
              <button
                key={disp.id}
                disabled={callState !== 'idle'}
                onClick={() => {
                  setOutcome(disp.id as any);
                  setShowPostCallModal(true);
                }}
                className="h-14 border border-gray-200 bg-white rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center transition-all"
              >
                <span className="material-symbols-outlined text-[16px] text-gray-500">{disp.icon}</span>
                <span className="text-[10px] font-bold text-gray-700 mt-1">{disp.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Send payment link */}
        <div className="mb-4">
          <button
            onClick={() => setShowLinkModal(true)}
            className="w-full bg-[#FB641B] hover:bg-[#e4540d] text-white h-11 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            Send Payment Link via WhatsApp
          </button>
        </div>

        {/* Skip Lead option */}
        <div className="mb-4">
          <button
            onClick={handleSkipLead}
            className="w-full border border-gray-300 text-gray-600 hover:bg-gray-100 h-11 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">skip_next</span>
            Skip Lead
          </button>
        </div>

        {/* Quick Note Input */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Quick Note</span>
            {noteSaving && <span className="text-[9px] text-gray-400 italic">saving...</span>}
          </div>
          <input
            type="text"
            value={quickNote}
            onChange={handleNoteChange}
            placeholder="Quick note while on call..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#27AE60] outline-none"
            maxLength={200}
          />
        </div>

        {/* End Call / Dial Call / Accept Incoming Button */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          {callState === 'incoming_ringing' ? (
            <div className="flex gap-2 items-center">
              {/* The SAN widget auto-expands to full size while
                  incoming_ringing so the agent can click its own native
                  Answer button directly — a real click landing inside
                  SAN's own document, the only path that reliably carries
                  two-way audio. A postMessage Answer here would either
                  bypass that real click or double-fire alongside it. */}
              <span className="flex-1 text-xs font-bold text-amber-600 flex items-center gap-1.5 animate-pulse">
                <span className="material-symbols-outlined text-[18px]">call</span>
                👈 Answer from the SAN Softphone widget
              </span>
              <button
                onClick={hangup}
                className="flex-1 bg-[#E74C3C] hover:bg-[#c0392b] text-white h-11 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">call_end</span>
                Reject
              </button>
            </div>
          ) : callState !== 'idle' ? (
            <button
              onClick={hangup}
              className="w-full bg-[#E74C3C] hover:bg-[#c0392b] text-white h-11 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-md animate-pulse"
            >
              <span className="material-symbols-outlined text-[18px]">call_end</span>
              Hangup Live Call
            </button>
          ) : (
            <button
              disabled={!leadPhone || leadPhone === '00000 00000' || agentState !== 'ready'}
              onClick={() => { invalidateQueueCache(); dial(leadPhone, userId, leadName, leadTmid, stateLead.isCampaign ? 'social_media' : 'driver'); }}
              className="w-full bg-[#27AE60] hover:bg-[#219653] disabled:bg-gray-300 disabled:cursor-not-allowed text-white h-11 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">phone</span>
              {agentState !== 'ready' ? 'Dialer Connecting...' : 'Dial Lead Call'}
            </button>
          )}
        </div>

      </section>

      {/* RIGHT COLUMN: Script Panel */}
      <section className="flex-1 flex flex-col bg-white overflow-hidden">

        {/* Script Tab Bar */}
        <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto scrollbar-none shrink-0">
          {[
            { key: 'profile', label: '👤 Driver Profile & Plans' },
            { key: 'opening', label: 'Opening Dialogue' },
            { key: 'jobReady', label: 'Job Ready Pitch' },
            { key: 'verified', label: 'Verified Upsell' },
            { key: 'trusted', label: 'Trusted Upsell' },
            { key: 'objections', label: 'Objections (Hindi)' },
            { key: 'closing', label: 'Closing' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${activeTab === tab.key
                  ? 'border-[#27AE60] text-[#27AE60] bg-white font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Script Content Area */}
        <div className="flex-grow overflow-y-auto p-6 min-h-0">
          <div className="max-w-[480px] mx-auto text-gray-800">

            {activeTab === 'profile' && (
              <div className="space-y-6 font-sans">
                {/* 1. Subscription Banner & Brief */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subscription Status</h3>
                    {planCard?.has_plan ? (
                      <span className="bg-green-100 text-green-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-green-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                        ACTIVE SUBSCRIBER
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                        FREE PROFILE
                      </span>
                    )}
                  </div>

                  {planCard?.has_plan ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800 space-y-1">
                      <div className="flex justify-between">
                        <span className="font-semibold">Plan Name:</span>
                        <span className="font-bold">{planCard.plan_label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Amount Paid:</span>
                        <span className="font-mono font-bold">₹{planCard.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Expires On:</span>
                        <span className="font-mono font-bold">{planCard.expires_at || 'Never'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                        This driver does not have any active subscription. Pitch one of our plans below!
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { name: 'Job Ready', price: '₹199', desc: '1 Year Plan' },
                          { name: 'Verified', price: '₹299', desc: 'Badge (3x)' },
                          { name: 'Trusted', price: '₹499', desc: 'Protected' }
                        ].map(p => (
                          <div key={p.name} className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
                            <div className="font-bold text-[10px] text-gray-800">{p.name}</div>
                            <div className="font-mono font-extrabold text-[#D35400] text-xs my-0.5">{p.price}</div>
                            <div className="text-[8px] text-gray-400 font-semibold">{p.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Complete Driver Profile Details */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-3 mb-3">
                    Driver Profile Sheet
                  </h3>
                  
                  {driverProfile ? (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">Name</span>
                        <span className="font-bold text-gray-800">{driverProfile.name || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">TMID / Unique ID</span>
                        <span className="font-mono font-bold text-gray-800">{driverProfile.tmid || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">Mobile Number</span>
                        <span className="font-mono font-bold text-gray-800">**********</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">Email ID</span>
                        <span className="font-bold text-gray-800 break-all">**********</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">City / State</span>
                        <span className="font-bold text-gray-800">
                          {driverProfile.city || driverProfile.state ? `${driverProfile.city || ''}${driverProfile.city && driverProfile.state ? ', ' : ''}${driverProfile.state || ''}` : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">Pincode</span>
                        <span className="font-mono font-bold text-gray-800">{driverProfile.pincode || '—'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">Address</span>
                        <span className="font-bold text-gray-800">{driverProfile.address || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">Father's Name</span>
                        <span className="font-bold text-gray-800">{driverProfile.father_name || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">DOB / Age</span>
                        <span className="font-mono font-bold text-gray-800">{driverProfile.dob || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">Gender / Marital</span>
                        <span className="font-bold text-gray-800">
                          {driverProfile.sex || driverProfile.marital_status ? `${driverProfile.sex || ''}${driverProfile.sex && driverProfile.marital_status ? ' / ' : ''}${driverProfile.marital_status || ''}` : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">Education</span>
                        <span className="font-bold text-gray-800">{driverProfile.education || '—'}</span>
                      </div>
                      
                      <div className="col-span-2 border-t border-gray-100 my-1 pt-2 font-bold text-[10px] text-gray-400 uppercase tracking-wide">
                        License & Professional details
                      </div>

                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">License Type</span>
                        <span className="font-bold text-gray-800">{driverProfile.license_type || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">License Number</span>
                        <span className="font-mono font-bold text-gray-800">{driverProfile.license_number || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">License Expiry</span>
                        <span className="font-mono font-bold text-gray-800">{driverProfile.license_expiry || '—'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">Driving Experience</span>
                        <span className="font-bold text-gray-800">{driverProfile.experience || '—'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">Preferred Vehicle Types</span>
                        <span className="font-bold text-gray-800">{driverProfile.vehicle_type || '—'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">Preferred Location / Routes</span>
                        <span className="font-bold text-gray-800">
                          {driverProfile.preferred_location || driverProfile.routes ? `${driverProfile.preferred_location || ''}${driverProfile.preferred_location && driverProfile.routes ? ' (' : ''}${driverProfile.routes || ''}${driverProfile.preferred_location && driverProfile.routes ? ')' : ''}` : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">Current / Expected Income</span>
                        <span className="font-bold text-gray-800">
                          {driverProfile.current_income ? `₹${driverProfile.current_income}` : '—'} / {driverProfile.expected_income ? `₹${driverProfile.expected_income}` : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-semibold block text-[10px] uppercase">Registered At</span>
                        <span className="font-mono font-bold text-gray-800">{driverProfile.registered_at || '—'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 italic py-4 text-center">
                      No profile data loaded. Select or dial a lead.
                    </div>
                  )}
                </div>

                {/* 3. Payments Database History mapping */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-3 mb-3">
                    Payments History (Database Verification)
                  </h3>
                  
                  {detailResponse?.data?.payments && detailResponse.data.payments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-[10px] border-collapse text-left">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 uppercase font-semibold">
                            <th className="pb-2">Date</th>
                            <th className="pb-2">Plan</th>
                            <th className="pb-2 text-right">Amount</th>
                            <th className="pb-2 pl-4">Transaction ID</th>
                            <th className="pb-2 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-gray-700">
                          {detailResponse.data.payments.map((p: any) => (
                            <tr key={p.id} className="hover:bg-gray-50/50">
                              <td className="py-2 font-mono">{p.created_at ? p.created_at.substring(0, 10) : '—'}</td>
                              <td className="py-2 font-semibold text-gray-800">{p.plan_label || '—'}</td>
                              <td className="py-2 text-right font-mono font-bold text-gray-900">₹{p.amount}</td>
                              <td className="py-2 pl-4 font-mono text-gray-400 break-all max-w-[80px] truncate" title={p.transaction_id || p.order_id}>
                                {p.transaction_id || p.order_id || '—'}
                              </td>
                              <td className="py-2 text-right">
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold ${
                                  p.payment_status === 'captured' ? 'bg-green-50 text-green-700 border border-green-200' :
                                  p.payment_status === 'failed' ? 'bg-red-50 text-red-700 border border-red-200' :
                                  'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  {p.payment_status ? p.payment_status.toUpperCase() : '—'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400 italic py-4 text-center">
                      No payment history logged for this driver.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'opening' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px]">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide font-sans">Greeting Dialogue</h3>
                <div className="bg-[#EAFAF1]/30 border-l-4 border-[#27AE60] p-4 rounded-r-xl">
                  "नमस्ते <strong>{leadName}</strong> जी, मैं ट्रक मित्र से बात कर रहा हूँ। आपका नया प्रोफाइल हमारे पोर्टल पर दिखा है, पंजीकरण करने के लिए धन्यवाद! <br /><br />
                  क्या यह सही समय है आपसे बात करने का? मैं आपकी प्रोफाइल को कम्प्लीट करवाने और नौकरी दिलाने के बारे में बातचीत करने के लिए कॉल कर रहा हूँ।"
                </div>
              </div>
            )}

            {activeTab === 'jobReady' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px]">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide font-sans">Job Ready Pitch (₹199)</h3>
                <div className="bg-[#EAFAF1]/30 border-l-4 border-[#27AE60] p-4 rounded-r-xl">
                  "राजेश जी, हमारा <strong>'जॉब रेडी'</strong> प्लान सिर्फ <strong>₹199</strong> का है जो 3 महीने के लिए रहेगा। <br /><br />
                  इसमें आपकी प्रोफाइल को हम डायरेक्ट एक्टिवेट कर देंगे, जिससे आसपास के ऑर्डर्स और कांटेक्ट डिटेल्स आपको तुरंत दिखने लगेंगे। नए ड्राइवर्स के लिए यह सबसे किफायती प्लान है।"
                </div>
              </div>
            )}

            {activeTab === 'verified' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px]">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide font-sans">Verified Upsell (₹299)</h3>
                <div className="bg-[#EAFAF1]/30 border-l-4 border-[#27AE60] p-4 rounded-r-xl">
                  "राजेश जी, हमारा सबसे लोकप्रिय प्लान <strong>'Verified Plan'</strong> है जो <strong>₹299</strong> का है। <br /><br />
                  इसमें आपकी प्रोफाइल पर <strong>'Verified Badge'</strong> (हरा टिक) लग जाता है। इससे ट्रांसपोर्टर्स और बड़े क्लाइंट्स का भरोसा बढ़ेगा और आपको 3 गुना अधिक बुकिंग मिलेंगी।"
                </div>
              </div>
            )}

            {activeTab === 'trusted' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px]">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide font-sans">Trusted Upsell (₹499)</h3>
                <div className="bg-[#EAFAF1]/30 border-l-4 border-[#27AE60] p-4 rounded-r-xl">
                  "राजेश जी, हमारा सबसे प्रीमियम प्लान <strong>'Trusted Plan'</strong> है जो <strong>₹499</strong> का है। <br /><br />
                  इसमें आपको <strong>100% पेमेंट प्रोटेक्शन (Payment Protection)</strong> मिलता है। यानी आपकी कमाई पूरी तरह से सुरक्षित रहेगी और किसी भी विवाद में हमारी सपोर्ट टीम 24 घंटे आपके साथ खड़ी रहेगी।"
                </div>
              </div>
            )}

            {activeTab === 'objections' && (
              <div className="space-y-4 font-sans">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type objection keyword (e.g. paisa, fraud)..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#27AE60]"
                  />
                </div>

                {bookmarks.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">My Bookmarks:</span>
                    {bookmarks.map(key => (
                      <span key={key} className="bg-[#EAFAF1] text-[#27AE60] border border-[#27AE60]/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        ★ {objections.find(o => o.key === key)?.question}
                      </span>
                    ))}
                  </div>
                )}

                <div className="space-y-3 mt-4">
                  {sortedObjections.map(obj => (
                    <div key={obj.key} className="border border-gray-200 rounded-xl p-4 bg-white relative hover:border-[#27AE60] transition-colors">
                      <div className="flex justify-between items-start pr-6">
                        <span className="text-sm font-bold text-red-600">{obj.question}</span>
                        <button
                          onClick={() => toggleBookmark(obj.key)}
                          className={`absolute right-3 top-3 text-sm transition-colors ${bookmarks.includes(obj.key) ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'}`}
                        >
                          ★
                        </button>
                      </div>
                      <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded border border-gray-100 font-hindi leading-relaxed">
                        {obj.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'closing' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px]">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide font-sans">Closing Script</h3>
                <div className="bg-[#EAFAF1]/30 border-l-4 border-[#27AE60] p-4 rounded-r-xl">
                  "तो राजेश जी, मैं आपके नंबर पर अभी 'Verified' प्लान का <strong>₹299</strong> का सुरक्षित पेमेंट लिंक भेज रहा हूँ। <br /><br />
                  आप Google Pay, PhonePe या Paytm से सिर्फ 1 मिनट में पेमेंट कर सकते हैं। पेमेंट होते ही हमारी टीम आपको कॉल करके पहला लोड बुक करवा देगी।"
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Voice sync strip */}
        <div className="h-8 bg-gray-900 flex items-center px-4 justify-between text-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60] animate-pulse"></span>
            <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Exotel Softphone Active</span>
          </div>
          <span className="text-[9px] font-mono text-gray-500">Live Recording Enabled</span>
        </div>
      </section>

      {/* PAYMENT LINK MODAL */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Send Payment Link</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-gray-500 block mb-1 font-semibold">Choose Subscription Plan</label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 outline-none font-semibold text-gray-800"
                >
                  <option value="Job Ready ₹199">Job Ready — ₹199 (3 months)</option>
                  <option value="Verified ₹299">Verified — ₹299 (3 months)</option>
                  <option value="Trusted ₹499">Trusted — ₹499 (3 months)</option>
                </select>
              </div>

              <div className="p-3 bg-gray-50 rounded border border-gray-100 font-mono text-[11px] text-gray-500 leading-normal">
                💬 <span className="font-bold text-gray-700">WhatsApp Message:</span>
                <p className="mt-1 font-sans text-xs">
                  "Hello {leadName}, thank you for choosing TruckMitr. Here is your payment link for {selectedPlan}: https://truckmitr.in/pay/{leadTmid}"
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 rounded font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendPaymentLink}
                  className="px-4 py-2 bg-[#FB641B] hover:bg-[#e4540d] text-white rounded font-bold transition-all shadow-sm"
                >
                  Send Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POST-CALL FORM GATED MODAL OVERLAY */}
      {showPostCallModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto relative text-xs">

            {/* Header */}
            <div className="border-b border-gray-100 pb-3 mb-4">
              <h2 className="text-sm font-bold text-gray-900 flex justify-between items-center">
                <span>Log Call — {leadName}</span>
                <span className="font-mono text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{leadTmid}</span>
              </h2>
              <div className="text-[10px] text-gray-400 mt-1">
                Duration: {formatTimer(seconds)}
              </div>
            </div>

            {/* Step 1 — Outcome */}
            <div className="space-y-2 mb-4">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Step 1 — Call Outcome *</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'connected', label: 'Connected', desc: 'कॉल जुड़ गया' },
                  { id: 'not_connected', label: 'Not Connected', desc: 'कॉल नहीं जुड़ा' },
                  { id: 'callback_later', label: 'Callback Later', desc: 'बाद में कॉल करें' }
                ].map(op => (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => {
                      setOutcome(op.id as any);
                      setLevel2Sub('');
                      setCallbackSub('');
                    }}
                    className={`p-2.5 border rounded-lg text-left transition-all ${outcome === op.id
                        ? 'border-[#27AE60] bg-[#EAFAF1]/30 ring-1 ring-[#27AE60]'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                  >
                    <div className="font-bold text-[11px] text-gray-800">{op.label}</div>
                    <div className="text-[9px] text-gray-400 mt-0.5 leading-tight">{op.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 — Level 2 options based on Outcome */}
            {outcome === 'not_connected' && (
              <div className="space-y-2 mb-4">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Step 2 — Reconnection State *</div>
                <div className="grid grid-cols-2 gap-2">
                  {isDriverWelcome ? (
                    DWC_NOT_CONNECTED_OPTIONS.map(opt => (
                      <label
                        key={opt}
                        className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${level2Sub === opt ? 'border-red-500 bg-red-50/20' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                      >
                        <input
                          type="radio"
                          name="level2Sub"
                          value={opt}
                          checked={level2Sub === opt}
                          onChange={() => setLevel2Sub(opt)}
                          className="accent-red-500 mr-2"
                        />
                        <div>
                          <div className="font-semibold text-[11px] text-gray-800">{opt}</div>
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
                        className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${level2Sub === item.value ? 'border-red-500 bg-red-50/20' : 'border-gray-200 bg-white hover:bg-gray-50'
                          }`}
                      >
                        <input
                          type="radio"
                          name="level2Sub"
                          value={item.value}
                          checked={level2Sub === item.value}
                          onChange={() => setLevel2Sub(item.value)}
                          className="accent-red-500 mr-2"
                        />
                        <div>
                          <div className="font-semibold text-[11px] text-gray-800">{item.label}</div>
                          <div className="text-[9px] text-gray-400">{item.label_hi}</div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            )}

            {outcome === 'callback_later' && (
              <div className="space-y-2 mb-4">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Step 2 — Callback Interval *</div>
                <div className="grid grid-cols-2 gap-2">
                  {isDriverWelcome ? (
                    DWC_CALLBACK_OPTIONS.map(opt => (
                      <label
                        key={opt}
                        className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${level2Sub === opt ? 'border-blue-500 bg-blue-50/20' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                      >
                        <input
                          type="radio"
                          name="level2Sub"
                          value={opt}
                          checked={level2Sub === opt}
                          onChange={() => setLevel2Sub(opt)}
                          className="accent-blue-500 mr-2"
                        />
                        <div>
                          <div className="font-semibold text-[11px] text-gray-800">{opt}</div>
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
                        className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${level2Sub === item.value ? 'border-blue-500 bg-blue-50/20' : 'border-gray-200 bg-white hover:bg-gray-50'
                          }`}
                      >
                        <input
                          type="radio"
                          name="level2Sub"
                          value={item.value}
                          checked={level2Sub === item.value}
                          onChange={() => setLevel2Sub(item.value)}
                          className="accent-blue-500 mr-2"
                        />
                        <div>
                          <div className="font-semibold text-[11px] text-gray-800">{item.label}</div>
                          <div className="text-[9px] text-gray-400">{item.label_hi}</div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
                {!isDriverWelcome && level2Sub === 'custom' && (
                  <div className="mt-2">
                    <input
                      type="datetime-local"
                      value={callbackAt}
                      onChange={e => setCallbackAt(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 outline-none font-semibold text-gray-800 text-xs"
                    />
                  </div>
                )}
              </div>
            )}

            {outcome === 'connected' && (
              <div className="space-y-2 mb-4">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Step 2 — Connected Outcome *</div>
                {isDriverWelcome ? (
                  <div className="w-full">
                    <select
                      value={level2Sub}
                      onChange={e => setLevel2Sub(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 outline-none font-semibold text-gray-800 text-xs"
                    >
                      <option value="">-- Choose Connected Feedback Option --</option>
                      {DWC_CONNECTED_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
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
                            className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${level2Sub === item.value ? 'border-[#27AE60] bg-[#EAFAF1]/30' : 'border-gray-200 bg-white hover:bg-gray-50'
                              }`}
                          >
                            <input
                              type="radio"
                              name="level2Sub"
                              value={item.value}
                              checked={level2Sub === item.value}
                              onChange={() => setLevel2Sub(item.value)}
                              className="accent-[#27AE60] mr-2"
                            />
                            <div>
                              <div className="font-semibold text-[11px] text-gray-800">{item.label}</div>
                              <div className="text-[9px] text-gray-400">{item.label_hi}</div>
                            </div>
                          </label>
                        ))}
                      </>
                    )}

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
                            className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${level2Sub === item.value ? 'border-[#27AE60] bg-[#EAFAF1]/30' : 'border-gray-200 bg-white hover:bg-gray-50'
                              }`}
                          >
                            <input
                              type="radio"
                              name="level2Sub"
                              value={item.value}
                              checked={level2Sub === item.value}
                              onChange={() => setLevel2Sub(item.value)}
                              className="accent-[#27AE60] mr-2"
                            />
                            <div>
                              <div className="font-semibold text-[11px] text-gray-800">{item.label}</div>
                              <div className="text-[9px] text-gray-400">{item.label_hi}</div>
                            </div>
                          </label>
                        ))}
                      </>
                    )}

                    {isMatchmaking && (
                      <>
                        {[
                          { value: 'placement_done', label: 'Driver Placement Done', label_hi: 'ड्राइवर प्लेसमेंट हो गया' },
                          { value: 'callback', label: 'Call Back Later', label_hi: 'बाद में कॉल करें' },
                          { value: 'rejected', label: 'Rejected by Driver/Transporter', label_hi: 'रिजेक्ट हो गया' }
                        ].map(item => (
                          <label
                            key={item.value}
                            className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${level2Sub === item.value ? 'border-[#27AE60] bg-[#EAFAF1]/30' : 'border-gray-200 bg-white hover:bg-gray-50'
                              }`}
                          >
                            <input
                              type="radio"
                              name="level2Sub"
                              value={item.value}
                              checked={level2Sub === item.value}
                              onChange={() => setLevel2Sub(item.value)}
                              className="accent-[#27AE60] mr-2"
                            />
                            <div>
                              <div className="font-semibold text-[11px] text-gray-800">{item.label}</div>
                              <div className="text-[9px] text-gray-400">{item.label_hi}</div>
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
            {outcome === 'connected' && (
              <div className="space-y-3 mb-4">

                {/* Subscription Flow */}


                {/* Callback Requested Flow */}
                {(!isDriverWelcome && level2Sub === 'interested_callback') && (
                  <>
                    <div>
                      <label className="text-gray-500 block mb-1 font-semibold">Callback Schedule Interval *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'tomorrow_morning', label: 'Tomorrow Morning', label_hi: 'कल सुबह (10 AM)' },
                          { value: 'tomorrow_evening', label: 'Tomorrow Evening', label_hi: 'कल शाम (5 PM)' },
                          { value: 'two_days_morning', label: 'In 2 Days', label_hi: '2 दिन बाद (10 AM)' },
                          { value: 'custom', label: 'Custom Date & Time', label_hi: 'कस्टम समय चुनें' }
                        ].map(item => (
                          <label
                            key={item.value}
                            className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${callbackSub === item.value ? 'border-blue-500 bg-blue-50/20' : 'border-gray-200 bg-white hover:bg-gray-50'
                              }`}
                          >
                            <input
                              type="radio"
                              name="callbackSub"
                              value={item.value}
                              checked={callbackSub === item.value}
                              onChange={() => setCallbackSub(item.value)}
                              className="accent-blue-500 mr-2"
                            />
                            <div>
                              <div className="font-semibold text-[10px] text-gray-800">{item.label}</div>
                              <div className="text-[8px] text-gray-400">{item.label_hi}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    {callbackSub === 'custom' && (
                      <div>
                        <label className="text-gray-500 block mb-1 font-semibold">Select Custom Date & Time *</label>
                        <input
                          type="datetime-local"
                          value={callbackAt}
                          onChange={e => setCallbackAt(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 outline-none font-semibold text-gray-800 text-xs"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Rejection / Not Interested Flow */}
                {(!isDriverWelcome && (level2Sub === 'not_interested' || level2Sub === 'rejected')) && (
                  <div>
                    <label className="text-gray-500 block mb-1 font-semibold">Reason for Rejection *</label>
                    <select
                      value={reason}
                      onChange={e => setReason(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs"
                    >
                      <option value="">Select a reason...</option>
                      {isMatchmaking
                        ? [
                          { value: 'not_interested_in_location', label: 'Not Interested in Location' },
                          { value: 'salary_too_low', label: 'Salary Too Low' },
                          { value: 'already_employed', label: 'Already Employed' },
                          { value: 'dont_like_transporter', label: 'Don\'t Like Transporter' },
                          { value: 'other', label: 'Other' }
                        ].map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))
                        : [
                          { value: 'already_have_loads', label: 'Already Have Loads' },
                          { value: 'using_other_app', label: 'Using Other App' },
                          { value: 'dont_trust_online', label: 'Don\'t Trust Online' },
                          { value: 'no_smartphone', label: 'No Smartphone' },
                          { value: 'price_too_high', label: 'Price Too High' },
                          { value: 'will_think', label: 'Will Think About It' },
                          { value: 'other', label: 'Other' }
                        ].map(r => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))
                      }
                    </select>
                  </div>
                )}

                {/* Language Barrier Flow */}
                {(!isDriverWelcome && level2Sub === 'language_barrier') && (
                  <div>
                    <label className="text-gray-500 block mb-1 font-semibold">Select Language Noted *</label>
                    <select
                      value={languageNoted}
                      onChange={e => setLanguageNoted(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs"
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
                {(!isDriverWelcome && level2Sub === 'placement_done') && (
                  <div>
                    <label className="text-gray-500 block mb-1 font-semibold">Verify Placement Stage *</label>
                    <select
                      value={feedbackStage}
                      onChange={e => setFeedbackStage(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-xs"
                    >
                      <option value="">Choose placement stage...</option>
                      {[
                        { value: '1', label: 'Stage 1: Profile Assessment' },
                        { value: '2', label: 'Stage 2: Document Verification' },
                        { value: '3', label: 'Stage 3: Interview Scheduled' },
                        { value: '4', label: 'Stage 4: Trial Drive' },
                        { value: '5', label: 'Stage 5: Background Check' },
                        { value: '6', label: 'Stage 6: Job Offer Extended' },
                        { value: '7', label: 'Stage 7: Offer Accepted' },
                        { value: '8', label: 'Stage 8: Final Placement Confirmed' }
                      ].map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}



            {/* Remarks / Notes */}
            {level2Sub && (
              <div className="space-y-1 mb-4">
                <label className="font-bold text-gray-700 block">General Remarks / Notes</label>
                <textarea
                  value={dispositionNotes}
                  onChange={(e) => setDispositionNotes(e.target.value)}
                  placeholder="Enter call remarks (Hindi mein bhi)..."
                  className="w-full border border-gray-200 rounded-lg p-2 outline-none focus:ring-1 focus:ring-[#27AE60] min-h-[60px]"
                />
              </div>
            )}

            {/* Submit Actions */}
            <div className="border-t border-gray-100 pt-4 mt-6 flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPostCallModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-500 hover:bg-gray-100 rounded-lg text-xs font-bold"
                >
                  Back to Softphone
                </button>

                <button
                  onClick={() => handleDispositionSubmit('stay')}
                  disabled={!canSubmit()}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${!canSubmit()
                      ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                      : 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold'
                    }`}
                >
                  Save & Stay on Lead
                </button>

                <button
                  onClick={() => handleDispositionSubmit(false)}
                  disabled={!canSubmit()}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${!canSubmit()
                      ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                      : 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold'
                    }`}
                >
                  Save & Close
                </button>
              </div>

              <button
                onClick={() => handleDispositionSubmit(true)}
                disabled={!canSubmit()}
                className={`w-full px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${!canSubmit()
                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                    : 'bg-[#27AE60] hover:bg-[#219653] text-white font-bold'
                  }`}
              >
                Save & Load Next Lead
              </button>
            </div>

          </div>
        </div>
      )}
      {/* RIGHT COLUMN: Queue / Next Leads */}
      <section className="w-[280px] border-l border-gray-200 flex flex-col bg-gray-50/50 shrink-0 overflow-y-auto p-4 select-none">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Queue (Next Leads)
        </h3>

        {nextLeads.length > 0 ? (
          <div className="space-y-2">
            {nextLeads.map((lead: any) => {
              const isActive = userId === lead.id;
              return (
                <div
                  key={lead.id}
                  onClick={() => {
                    if (!isActive && callState === 'idle') {
                      if (queueType) {
                        // Keep batchPos in sync so "Load Next Lead" continues
                        // forward from wherever the agent just skipped to.
                        const idx = batch.findIndex((l: any) => l.id === lead.id);
                        if (idx >= 0) setBatchPos(idx);
                      }
                      setUserId(lead.id);
                      setSeconds(0);
                    }
                  }}
                  className={`p-3 rounded-lg border text-xs transition-all cursor-pointer ${isActive
                      ? 'border-[#27AE60] bg-[#EAFAF1] font-bold text-[#27AE60] shadow-sm'
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-semibold truncate max-w-[140px]">{lead.name || 'Unknown'}</span>
                    <span className="font-mono text-[9px] bg-gray-100 text-gray-500 px-1 py-0.5 rounded ml-1">
                      {lead.tmid}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1 flex justify-between">
                    <span>**********</span>
                    <span className="font-semibold text-gray-400 capitalize">{lead.last_status || 'Fresh'}</span>
                  </div>
                  {isActive && (
                    <div className="text-[9px] text-[#27AE60] font-bold mt-1.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60] animate-pulse"></span>
                      Currently Active
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-400 italic text-xs py-8">
            Queue is empty
          </div>
        )}
      </section>

    </main>
  );
};

export default DwActiveCallFocus;
