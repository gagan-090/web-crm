import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ConfirmState {
  jobId: string;
  jobRoute: string;
  jobTransporter: string;
  driverName: string;
  driverTmid: string;
}

export const MmPlacementConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Resolve state passed from Intro Manager / Job Detail
  const state: ConfirmState = location.state || {
    jobId: 'JD-12034',
    jobRoute: 'Delhi ➔ Mumbai',
    jobTransporter: 'Sharma Logistics',
    driverName: 'Suresh Yadav',
    driverTmid: 'DR-48291'
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Required checklist toggles
  const [startDateConfirmed, setStartDateConfirmed] = useState(false);
  const [jobCompletionConfirmed, setJobCompletionConfirmed] = useState(false);
  const [transporterConfirmedViaApp, setTransporterConfirmedViaApp] = useState(false);
  
  const [placementNotes, setPlacementNotes] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auto commission check simulation: Suresh Yadav (DR-48291) is linked to Ramesh Foreman (FM-00231)
  const isDriverLinkedToForeman = state.driverTmid === 'DR-48291';
  const foremanId = 'FM-00231';
  const foremanName = 'Ramesh Foreman Services';

  const handleConfirmPlacement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDateConfirmed || !jobCompletionConfirmed || !transporterConfirmedViaApp) {
      triggerToast('Please check all confirmation toggles to finalize.');
      return;
    }

    // Redirect with success toast
    navigate('/mm/mm-job-board');
    // We send triggerToast msg in navigation redirect simulation
    setTimeout(() => {
      alert(`Job ${state.jobId} marked Filled successfully! Incentive added.`);
    }, 50);
  };

  return (
    <main className="p-6 max-w-md mx-auto w-full bg-white border border-gray-200 rounded-xl shadow-sm my-6 text-xs relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#8E44AD]"></span>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h2 className="text-sm font-extrabold text-gray-800 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#8E44AD] text-base">check_circle</span>
          Confirm Placement Handover
        </h2>
        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Formalize EOD commission payout and filled status</p>
      </div>

      <form onSubmit={handleConfirmPlacement} className="space-y-4">
        
        {/* Read-only Job/Driver context */}
        <div className="bg-gray-50 border border-gray-150 rounded-xl p-3 space-y-1.5 font-bold text-gray-700 select-none">
          <div>Job ID: <span className="font-mono text-gray-900">{state.jobId}</span></div>
          <div>Transporter: <span className="text-gray-900">{state.jobTransporter}</span></div>
          <div>Placed Driver: <span className="text-gray-900">{state.driverName} ({state.driverTmid})</span></div>
        </div>

        {/* COMMISSION AUTO-CHECK CARD */}
        {isDriverLinkedToForeman && (
          <div className="bg-purple-50 border border-purple-200 text-[#7D3C98] rounded-xl p-3.5 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider block">⚡ COMMISSION AUTO-CREDIT DETECTED</span>
            <p className="font-semibold leading-relaxed">
              This driver is linked to <span className="font-bold">{foremanId} ({foremanName})</span>.
            </p>
            <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
              ₹100 commission will be auto-credited to the Foreman. Your incentive: ₹50 (Super Premium) for this placement event.
            </p>
          </div>
        )}

        {/* Confirmation checkboxes */}
        <div className="space-y-3 pt-2">
          <label className="text-[10px] font-extrabold text-gray-450 uppercase tracking-wider block">Compliance Checks</label>
          
          <label className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-150 rounded-lg cursor-pointer">
            <span className="font-semibold text-gray-700">Start date confirmed by transporter?</span>
            <input 
              type="checkbox" 
              checked={startDateConfirmed}
              onChange={(e) => setStartDateConfirmed(e.target.checked)}
              className="rounded text-[#8E44AD] focus:ring-[#8E44AD]"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-150 rounded-lg cursor-pointer">
            <span className="font-semibold text-gray-700">Job completion confirmed (not just matched)?</span>
            <input 
              type="checkbox" 
              checked={jobCompletionConfirmed}
              onChange={(e) => setJobCompletionConfirmed(e.target.checked)}
              className="rounded text-[#8E44AD] focus:ring-[#8E44AD]"
            />
          </label>

          <label className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-150 rounded-lg cursor-pointer">
            <span className="font-semibold text-gray-700">Transporter confirmed via app?</span>
            <input 
              type="checkbox" 
              checked={transporterConfirmedViaApp}
              onChange={(e) => setTransporterConfirmedViaApp(e.target.checked)}
              className="rounded text-[#8E44AD] focus:ring-[#8E44AD]"
            />
          </label>
        </div>

        {/* Notes */}
        <div>
          <label className="text-gray-500 block mb-1 font-semibold">Placement notes (optional)</label>
          <textarea 
            value={placementNotes}
            onChange={(e) => setPlacementNotes(e.target.value)}
            placeholder="Add any specific delivery/dispatch notes here..."
            rows={2}
            className="w-full border border-gray-200 rounded px-2.5 py-1.5 outline-none font-medium text-gray-800 resize-none"
          />
        </div>

        {/* CTA */}
        <div className="pt-2">
          <button 
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-bold text-center shadow-md shadow-green-100 transition-all active:scale-95 text-xs"
          >
            Confirm Placement &amp; Close Job
          </button>
        </div>

      </form>
    </main>
  );
};

export default MmPlacementConfirmation;
