import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface IntroState {
  jobId: string;
  jobRoute: string;
  jobTransporter: string;
  driverName: string;
  driverTmid: string;
}

export const MmIntroManager: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Resolve state passed from Active Call Focus / Job Board
  const state: IntroState = location.state || {
    jobId: 'JD-12034',
    jobRoute: 'Delhi ➔ Mumbai',
    jobTransporter: 'Sharma Logistics',
    driverName: 'Suresh Yadav',
    driverTmid: 'DR-48291'
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Stepper completed states
  const [step2Done, setStep2Done] = useState(false);
  const [step3Done, setStep3Done] = useState(false);
  const [step4Done, setStep4Done] = useState(false);
  const [step5Done, setStep5Done] = useState(false);

  // Joining confirmation inline form
  const [startDateConfirmed, setStartDateConfirmed] = useState(false);
  const [transporterAcknowledged, setTransporterAcknowledged] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateWhatsAppGroup = () => {
    setStep2Done(true);
    triggerToast('Pre-filling WhatsApp 3-Way Intro Group via deep link...');
    // Simulated WhatsApp Web deep link
    window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(`Hello! Sourcing introduction for Job ${state.jobId}. Driver: ${state.driverName}, Transporter: ${state.jobTransporter}.`), '_blank');
  };

  const handleShareContact = () => {
    setStep3Done(true);
    triggerToast('Transporter contact credentials sent to driver WhatsApp ✓');
  };

  const handleSetReminder = () => {
    setStep4Done(true);
    triggerToast('24-hour follow-up callback reminder set on calendar ✓');
  };

  const handleConfirmJoiningSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDateConfirmed || !transporterAcknowledged) {
      triggerToast('All confirmation toggles are required to finalize joining.');
      return;
    }
    setStep5Done(true);
    triggerToast('Joining confirmed by both parties ✓');
  };

  const handleMarkJobFilled = () => {
    navigate('/mm/mm-placement-confirmation', {
      state: {
        jobId: state.jobId,
        jobRoute: state.jobRoute,
        jobTransporter: state.jobTransporter,
        driverName: state.driverName,
        driverTmid: state.driverTmid
      }
    });
  };

  return (
    <main className="p-6 max-w-2xl mx-auto w-full bg-white border border-gray-200 rounded-xl shadow-sm my-6 text-xs relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#8E44AD]"></span>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-5">
        <div className="flex items-center justify-between">
          <span className="bg-purple-100 text-[#7D3C98] font-extrabold px-2 py-0.5 rounded text-[10px]">
            3-WAY INTRO STEPS
          </span>
          <span className="font-mono text-gray-400 font-bold">{state.jobId}</span>
        </div>
        <h2 className="text-sm font-extrabold text-gray-800 mt-2">
          Introduce Driver {state.driverName} ({state.driverTmid}) to {state.jobTransporter}
        </h2>
        <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Route: {state.jobRoute}</p>
      </div>

      {/* Stepper Checklist */}
      <div className="space-y-4">
        
        {/* Step 1 */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
              ✓
            </div>
            <div className="w-0.5 h-12 bg-gray-200"></div>
          </div>
          <div className="flex-1 pt-0.5">
            <h4 className="font-bold text-gray-800">Step 1: Driver confirmed interest</h4>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Logged via call disposition gate.</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
              step2Done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step2Done ? '✓' : '2'}
            </div>
            <div className="w-0.5 h-12 bg-gray-200"></div>
          </div>
          <div className="flex-1 pt-0.5 flex justify-between items-start">
            <div>
              <h4 className="font-bold text-gray-800">Step 2: WhatsApp intro group created</h4>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Pre-fill chat details to match driver and transporter.</p>
            </div>
            {!step2Done ? (
              <button 
                onClick={handleCreateWhatsAppGroup}
                className="bg-[#8E44AD] hover:bg-[#7D3C98] text-white px-3 py-1 rounded font-bold shadow-sm"
              >
                Create WA Group
              </button>
            ) : (
              <span className="text-green-600 font-bold">✓ Done</span>
            )}
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
              step3Done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step3Done ? '✓' : '3'}
            </div>
            <div className="w-0.5 h-12 bg-gray-200"></div>
          </div>
          <div className="flex-1 pt-0.5 flex justify-between items-start">
            <div>
              <h4 className="font-bold text-gray-800">Step 3: Share transporter contact credentials</h4>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Send masked details directly to driver.</p>
            </div>
            {!step3Done ? (
              <button 
                onClick={handleShareContact}
                disabled={!step2Done}
                className={`px-3 py-1 rounded font-bold shadow-sm ${
                  step2Done ? 'bg-[#8E44AD] text-white hover:bg-[#7D3C98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Share Contact
              </button>
            ) : (
              <span className="text-green-600 font-bold">✓ Shared</span>
            )}
          </div>
        </div>

        {/* Step 4 */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
              step4Done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step4Done ? '✓' : '4'}
            </div>
            <div className="w-0.5 h-12 bg-gray-200"></div>
          </div>
          <div className="flex-1 pt-0.5 flex justify-between items-start">
            <div>
              <h4 className="font-bold text-gray-800">Step 4: Follow-up reminder</h4>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Set 24hr follow-up to check response.</p>
            </div>
            {!step4Done ? (
              <button 
                onClick={handleSetReminder}
                disabled={!step3Done}
                className={`px-3 py-1 rounded font-bold shadow-sm ${
                  step3Done ? 'bg-[#8E44AD] text-white hover:bg-[#7D3C98]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Set Reminder
              </button>
            ) : (
              <span className="text-green-600 font-bold">✓ Reminder Set</span>
            )}
          </div>
        </div>

        {/* Step 5 */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
              step5Done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {step5Done ? '✓' : '5'}
            </div>
          </div>
          <div className="flex-1 pt-0.5">
            <h4 className="font-bold text-gray-800">Step 5: Confirm joining agreement</h4>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Verify that both parties agree to start date.</p>

            {step4Done && !step5Done && (
              <form onSubmit={handleConfirmJoiningSubmit} className="mt-3 bg-gray-50 border border-gray-150 p-3 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Start date confirmed?</span>
                  <input 
                    type="checkbox" 
                    checked={startDateConfirmed}
                    onChange={(e) => setStartDateConfirmed(e.target.checked)}
                    className="rounded text-[#8E44AD] focus:ring-[#8E44AD]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Transporter acknowledged joining?</span>
                  <input 
                    type="checkbox" 
                    checked={transporterAcknowledged}
                    onChange={(e) => setTransporterAcknowledged(e.target.checked)}
                    className="rounded text-[#8E44AD] focus:ring-[#8E44AD]"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#8E44AD] text-white py-1.5 rounded-lg font-bold hover:bg-[#7D3C98] shadow-sm"
                >
                  Confirm Agreement
                </button>
              </form>
            )}

            {step5Done && (
              <span className="text-green-600 font-bold block mt-2">✓ Joining Confirmed</span>
            )}
          </div>
        </div>

      </div>

      {/* Footer and Mark Filled CTA */}
      <div className="mt-8 pt-5 border-t border-gray-200 flex flex-col gap-3">
        <button
          onClick={handleMarkJobFilled}
          disabled={!step5Done}
          className={`w-full py-2.5 rounded-xl font-bold text-center text-xs shadow-md ${
            step5Done ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer' : 'bg-gray-100 text-gray-450 cursor-not-allowed'
          }`}
        >
          Proceed to Placement Confirmation
        </button>

        <p className="text-[10px] text-gray-400 text-center select-none mt-1">
          ⚙️ Audit Trail: All intro steps logged with timestamp. Handover record is immutable.
        </p>
      </div>

    </main>
  );
};

export default MmIntroManager;
