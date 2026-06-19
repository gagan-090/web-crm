import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../app/rootReducer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  setCallStatus,
  setActiveDialerLead,
  toggleMute,
  tickTimer,
  resetTimer
} from '../slices/queueStateSlice';
import { incrementCallCount } from '../../../app/slices/userSlice';

// Disposition Schema
const dispositionSchema = z.object({
  disposition: z.string().min(1, 'Please select a disposition status'),
  callbackDate: z.string().optional(),
  callbackTime: z.string().optional(),
  remarks: z.string().min(3, 'Remarks must be at least 3 characters long')
});

type DispositionInput = z.infer<typeof dispositionSchema>;

export const ActiveCallPage: React.FC = () => {
  const dispatch = useDispatch();
  
  // Dialer states from Redux
  const activeLead = useSelector((state: RootState) => state.queueState.activeLead);
  const callStatus = useSelector((state: RootState) => state.queueState.callStatus);
  const isMuted = useSelector((state: RootState) => state.queueState.isMuted);
  const secondsElapsed = useSelector((state: RootState) => state.queueState.secondsElapsed);

  // Local tabs inside scripts panel
  const [activeTab, setActiveTab] = useState<'script' | 'pricing'>('script');

  // Form setup
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<DispositionInput>({
    resolver: zodResolver(dispositionSchema),
    defaultValues: {
      disposition: '',
      callbackDate: '',
      callbackTime: '',
      remarks: ''
    }
  });

  const selectedDisposition = watch('disposition');

  // Handle dialer timer ticks
  useEffect(() => {
    let timer: any;
    if (callStatus === 'connected') {
      timer = setInterval(() => {
        dispatch(tickTimer());
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  // Load a mock lead if none is active
  useEffect(() => {
    if (!activeLead) {
      dispatch(setActiveDialerLead({
        id: 'LD-4013',
        name: 'Manish Kumar (Driver)',
        phone: '+91 91234 56789',
        process: 'Driver Welcome',
        status: 'NEW'
      }));
    }
  }, [activeLead]);

  const handleDial = () => {
    dispatch(setCallStatus('dialing'));
    // Simulate connection after 2 seconds
    setTimeout(() => {
      dispatch(setCallStatus('connected'));
      dispatch(resetTimer());
    }, 2000);
  };

  const handleEndCall = () => {
    dispatch(setCallStatus('wrapup'));
  };

  const onSaveDisposition = (data: DispositionInput) => {
    dispatch(incrementCallCount());
    alert(`Call saved successfully!
Status: ${data.disposition}
Remarks: ${data.remarks}
Callback: ${data.callbackDate ? `${data.callbackDate} ${data.callbackTime}` : 'None'}`);
    
    // Fetch next lead in queue
    dispatch(setActiveDialerLead({
      id: 'LD-4018',
      name: 'Sher Singh (Transporter)',
      phone: '+91 82233 44556',
      process: 'Transporter Welcome',
      status: 'NEW'
    }));
    reset();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  if (!activeLead) return null;

  return (
    <div className="w-full max-w-[1200px] grid grid-cols-12 gap-md items-start">
      {/* Left Details & Dialer Status Panel (8 columns) */}
      <div className="col-span-8 space-y-md">
        
        {/* Softphone status card */}
        <div className="bg-[#1b1c1c] text-white p-lg border border-outline rounded-sm flex items-center justify-between flipkart-shadow">
          <div>
            <div className="flex items-center gap-sm">
              <span className="px-2 py-0.5 bg-primary text-white text-[9px] font-bold rounded-sm uppercase">
                {activeLead.process}
              </span>
              <span className="text-outline text-xs font-data-mono">{activeLead.id}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-xs">{activeLead.name}</h2>
            <p className="text-sm font-data-mono text-outline-variant mt-xs">{activeLead.phone}</p>
          </div>

          {/* Dialer controls */}
          <div className="flex items-center gap-md">
            {callStatus === 'connected' && (
              <span className="font-data-mono text-lg font-extrabold text-red-500 mr-sm animate-pulse">
                {formatTime(secondsElapsed)}
              </span>
            )}
            
            {callStatus === 'idle' && (
              <button
                onClick={handleDial}
                className="px-lg py-sm bg-green-600 hover:bg-green-700 text-white font-bold rounded-sm text-xs flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-sm">phone</span>
                <span>DIAL CALL</span>
              </button>
            )}

            {callStatus === 'dialing' && (
              <div className="flex items-center gap-md">
                <span className="text-xs text-outline animate-pulse">DIALING LINK...</span>
                <button
                  onClick={handleEndCall}
                  className="px-md py-sm bg-error hover:bg-red-700 text-white font-bold rounded-sm text-xs"
                >
                  CANCEL
                </button>
              </div>
            )}

            {callStatus === 'connected' && (
              <div className="flex gap-sm">
                <button
                  onClick={() => dispatch(toggleMute())}
                  className={`p-sm rounded-sm border ${
                    isMuted ? 'bg-amber-500 text-black border-amber-600' : 'bg-transparent text-white border-outline hover:bg-[#303030]'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  <span className="material-symbols-outlined text-sm">
                    {isMuted ? 'mic_off' : 'mic'}
                  </span>
                </button>
                <button
                  onClick={handleEndCall}
                  className="px-lg py-sm bg-error hover:bg-red-700 text-white font-bold rounded-sm text-xs flex items-center gap-xs"
                >
                  <span className="material-symbols-outlined text-sm">call_end</span>
                  <span>DISCONNECT</span>
                </button>
              </div>
            )}

            {callStatus === 'wrapup' && (
              <span className="text-xs text-amber-500 font-bold border border-amber-500 px-sm py-1 rounded-sm">
                WRAP-UP STATE
              </span>
            )}
          </div>
        </div>

        {/* Post-Call Disposition Gate */}
        <div className="bg-white p-lg border border-outline-variant rounded-sm flipkart-shadow">
          <h3 className="font-headline-md text-xs font-extrabold uppercase text-on-surface mb-md">
            Call Disposition & Remarks
          </h3>

          <form onSubmit={handleSubmit(onSaveDisposition)} className="space-y-md">
            <div className="grid grid-cols-2 gap-md">
              
              {/* Disposition dropdown */}
              <div className="space-y-xs">
                <label className="text-xs font-semibold text-outline">Call Outcome</label>
                <select
                  disabled={callStatus === 'idle' || callStatus === 'dialing'}
                  {...register('disposition')}
                  className={`w-full px-sm py-xs border rounded-sm outline-none focus:ring-1 focus:ring-primary text-xs bg-white ${
                    errors.disposition ? 'border-error' : 'border-outline-variant'
                  }`}
                >
                  <option value="">Select Disposition Outcome</option>
                  <option value="Interested">Interested / Completed</option>
                  <option value="Callback">Request Callback</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Busy">Busy / Switch Off</option>
                </select>
                {errors.disposition && (
                  <p className="text-error text-[10px] font-semibold">{errors.disposition.message}</p>
                )}
              </div>

              {/* Callback Scheduler */}
              {selectedDisposition === 'Callback' && (
                <div className="grid grid-cols-2 gap-sm">
                  <div className="space-y-xs">
                    <label className="text-xs font-semibold text-outline">Callback Date</label>
                    <input
                      type="date"
                      {...register('callbackDate')}
                      className="w-full px-xs py-0.5 border border-outline-variant rounded-sm text-xs"
                    />
                  </div>
                  <div className="space-y-xs">
                    <label className="text-xs font-semibold text-outline">Callback Time</label>
                    <input
                      type="time"
                      {...register('callbackTime')}
                      className="w-full px-xs py-0.5 border border-outline-variant rounded-sm text-xs"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Remarks Textarea */}
            <div className="space-y-xs">
              <label className="text-xs font-semibold text-outline">Call Conversation Remarks</label>
              <textarea
                disabled={callStatus === 'idle' || callStatus === 'dialing'}
                rows={3}
                {...register('remarks')}
                placeholder="Enter summary notes of the caller conversation..."
                className={`w-full px-sm py-xs border rounded-sm outline-none focus:ring-1 focus:ring-primary text-xs ${
                  errors.remarks ? 'border-error' : 'border-outline-variant'
                }`}
              />
              {errors.remarks && (
                <p className="text-error text-[10px] font-semibold">{errors.remarks.message}</p>
              )}
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={callStatus !== 'wrapup'}
              className="w-full bg-[#2874F0] hover:bg-primary-container disabled:opacity-50 text-white font-bold py-sm rounded-sm text-xs"
            >
              SAVE CALL DISPOSITION
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Scripts & Helper Panel (4 columns) */}
      <div className="col-span-4 bg-white border border-outline-variant rounded-sm flipkart-shadow min-h-[400px] flex flex-col">
        {/* Panel Tabs */}
        <div className="flex border-b border-outline-variant text-xs">
          <button
            onClick={() => setActiveTab('script')}
            className={`flex-1 py-sm font-bold text-center border-b-2 ${
              activeTab === 'script' ? 'border-primary text-primary bg-surface-container-low' : 'border-transparent text-outline hover:bg-surface-container-low'
            }`}
          >
            Caller Script (Hindi)
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex-1 py-sm font-bold text-center border-b-2 ${
              activeTab === 'pricing' ? 'border-primary text-primary bg-surface-container-low' : 'border-transparent text-outline hover:bg-surface-container-low'
            }`}
          >
            Pricing Sheet
          </button>
        </div>

        {/* Panel Content */}
        <div className="p-md flex-grow overflow-y-auto custom-scrollbar text-xs">
          {activeTab === 'script' ? (
            <div className="space-y-md">
              <div className="bg-primary-fixed p-sm rounded-sm border border-outline-variant font-semibold text-primary">
                1. GREETING (स्वागत वाक्य)
              </div>
              <p className="font-body-hindi text-body-hindi text-on-surface leading-relaxed">
                "नमस्कार, मैं ट्रक मित्र से बात कर रहा/रही हूँ। क्या मेरी बात मनीष जी से हो रही है? मनीष जी, आपका नया ट्रक रजिस्टर हुआ है, उसकी बधाई। क्या मैं आपकी गाड़ी को अटैच करने के लिए ५ मिनट ले सकता हूँ?"
              </p>
              <div className="bg-primary-fixed p-sm rounded-sm border border-outline-variant font-semibold text-primary mt-md">
                2. SERVICE SUMMARY (सेवा का विवरण)
              </div>
              <p className="font-body-hindi text-body-hindi text-on-surface leading-relaxed">
                "ट्रक मित्र में गाड़ी अटैच करने से आपको पूरे भारत के रूट के लिए लोड आसानी से मिल जायेंगे। साथ ही, आपको फास्टैग और जीपीएस पर १०% की छूट मिलेगी।"
              </p>
            </div>
          ) : (
            <div className="space-y-md">
              <div className="p-sm bg-surface-container-low border border-outline-variant rounded-sm font-semibold">
                Fastag & GPS Pricing Packages
              </div>
              <div className="space-y-sm">
                <div className="flex justify-between border-b border-outline-variant pb-xs">
                  <span>Fastag Standard</span>
                  <span className="font-bold">₹200 (₹50 cashback)</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant pb-xs">
                  <span>GPS Tracker (1 Year)</span>
                  <span className="font-bold">₹1,800 (Free Install)</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant pb-xs">
                  <span>Combo Pack</span>
                  <span className="font-bold text-primary">₹1,900</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ActiveCallPage;
