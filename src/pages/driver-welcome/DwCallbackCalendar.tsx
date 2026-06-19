import React, { useState } from 'react';

export const DwCallbackCalendar: React.FC = () => {
  const [view, setView] = useState<'day' | 'week'>('day');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCallLead = (leadName: string) => {
    showToast(`Initiating call with scheduled lead: ${leadName}`);
  };

  return (
    <main className="flex flex-col relative w-full h-full max-w-6xl mx-auto bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-md left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-lg py-sm rounded shadow-lg z-50 text-xs font-semibold flex items-center gap-xs border border-outline animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[16px] text-accent-success">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Top Banner Alert */}
      <div className="bg-error text-on-error px-lg py-3 flex justify-between items-center shrink-0 shadow-md z-10">
        <div className="flex items-center gap-md text-xs">
          <span className="material-symbols-outlined text-sm animate-bounce">warning</span>
          <p className="font-bold uppercase tracking-wider">3 Overdue Callbacks: Immediate attention required</p>
        </div>
        <div className="flex gap-sm text-xs">
          <div className="flex items-center bg-white/20 px-md py-1 rounded text-on-error font-bold border border-white/25">
            <span>Rajesh K. (08:30)</span>
            <button 
              onClick={() => handleCallLead('Rajesh Kumar')}
              className="ml-md px-sm py-0.5 bg-white text-error rounded font-bold hover:bg-white/90 transition-colors"
            >
              Call Now
            </button>
          </div>
          <div className="flex items-center bg-white/20 px-md py-1 rounded text-on-error font-bold border border-white/25">
            <span>Emily T. (10:30)</span>
            <button 
              onClick={() => handleCallLead('Emily Thompson')}
              className="ml-md px-sm py-0.5 bg-white text-error rounded font-bold hover:bg-white/90 transition-colors"
            >
              Call Now
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Navigation & View Switcher */}
      <div className="p-md bg-surface-container-low border-b border-outline-variant flex justify-between items-center shrink-0">
        <div className="flex items-center gap-md">
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-wide">Callback Schedule</h2>
          <div className="h-4 w-px bg-outline-variant"></div>
          <h3 className="text-sm font-bold text-primary">Monday, Oct 23</h3>
        </div>
        
        {/* Toggle buttons */}
        <div className="bg-surface-container-high p-1 rounded-lg flex items-center gap-xs">
          <button
            onClick={() => setView('day')}
            className={`px-4 py-1 text-xs font-semibold rounded-md transition-all ${
              view === 'day' ? 'bg-white text-primary shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Day View
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-1 text-xs font-semibold rounded-md transition-all ${
              view === 'week' ? 'bg-white text-primary shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Week View
          </button>
        </div>
      </div>

      {/* Main View scroll canvas */}
      <div className="flex-grow overflow-y-auto p-lg bg-background">
        
        {view === 'day' ? (
          <div className="max-w-4xl mx-auto space-y-md animate-in fade-in duration-300">
            <div className="flex justify-between items-center text-xs">
              <span className="text-on-surface-variant font-semibold">October 2026</span>
              <div className="flex gap-md">
                <span className="flex items-center gap-xs"><span className="w-2.5 h-2.5 bg-error rounded-full block"></span> Overdue</span>
                <span className="flex items-center gap-xs"><span className="w-2.5 h-2.5 bg-orange-500 rounded-full block"></span> Next 1 Hr</span>
                <span className="flex items-center gap-xs"><span className="w-2.5 h-2.5 bg-primary rounded-full block"></span> Scheduled</span>
              </div>
            </div>

            <div className="relative bg-white rounded-xl border border-outline-variant shadow-sm min-h-[580px] text-xs">
              
              {/* Hours marker on the left */}
              <div className="absolute left-0 top-0 bottom-0 w-20 border-r border-outline-variant flex flex-col pt-4">
                {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map(hour => (
                  <div key={hour} className="h-16 flex items-center justify-center font-mono-data text-on-surface-variant border-b border-outline-variant/10">
                    {hour}
                  </div>
                ))}
              </div>

              {/* Time grid blocks */}
              <div className="ml-20 p-md relative h-full min-h-[580px]">
                
                {/* 08:30 Overdue card */}
                <div className="absolute top-[48px] left-md right-md bg-error/5 border-l-4 border-error p-md rounded-r shadow-sm flex items-center justify-between hover:bg-error/10 transition-colors">
                  <div className="flex items-center gap-md">
                    <div className="bg-error text-white w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">call</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-sm">Rajesh Kumar</h4>
                      <p className="text-on-surface-variant text-[11px] mt-0.5">Registration follow-up • Scheduled 08:30 AM <span className="font-bold text-error ml-1">(Overdue by 45m)</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-md">
                    <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded text-[10px] font-bold">CRITICAL</span>
                    <button 
                      onClick={() => handleCallLead('Rajesh Kumar')}
                      className="bg-error text-on-error px-md py-1.5 rounded font-bold hover:brightness-95 active:scale-95 transition-all"
                    >
                      Call Now
                    </button>
                  </div>
                </div>

                {/* 10:30 Soon card */}
                <div className="absolute top-[176px] left-md right-md bg-orange-50 border-l-4 border-orange-500 p-md rounded-r shadow-sm flex items-center justify-between hover:bg-orange-100 transition-colors">
                  <div className="flex items-center gap-md">
                    <div className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">chat</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-sm">Emily Thompson</h4>
                      <p className="text-on-surface-variant text-[11px] mt-0.5">Brochure Delivery Confirmation • Starts in 22m (10:30 AM)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-md">
                    <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-[10px] font-bold">SOON</span>
                    <button 
                      onClick={() => handleCallLead('Emily Thompson')}
                      className="text-orange-800 border border-orange-300 hover:bg-white px-md py-1.5 rounded font-bold transition-all"
                    >
                      Open Lead
                    </button>
                  </div>
                </div>

                {/* 13:00 Regular Scheduled card */}
                <div className="absolute top-[320px] left-md right-md bg-primary/5 border-l-4 border-primary p-md rounded-r shadow-sm flex items-center justify-between hover:bg-primary/10 transition-colors">
                  <div className="flex items-center gap-md">
                    <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">call</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-sm">Marcus Vane</h4>
                      <p className="text-on-surface-variant text-[11px] mt-0.5">Pricing Objection Review • Scheduled 01:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-md">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-bold">SCHEDULED</span>
                    <button 
                      onClick={() => handleCallLead('Marcus Vane')}
                      className="bg-primary text-on-primary px-md py-1.5 rounded font-bold hover:brightness-95 active:scale-95 transition-all"
                    >
                      Call Now
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          /* Week View */
          <div className="max-w-5xl mx-auto flex flex-col h-full animate-in fade-in duration-300 text-xs">
            <div className="grid grid-cols-7 gap-sm mb-md text-center">
              {[
                { day: 'Mon', num: 23, current: true },
                { day: 'Tue', num: 24 },
                { day: 'Wed', num: 25 },
                { day: 'Thu', num: 26 },
                { day: 'Fri', num: 27 },
                { day: 'Sat', num: 28 },
                { day: 'Sun', num: 29 }
              ].map(d => (
                <div 
                  key={d.num} 
                  className={`p-sm rounded border ${
                    d.current 
                      ? 'bg-primary/5 border-primary text-primary font-bold shadow-sm' 
                      : 'bg-white border-outline-variant/60 text-on-surface-variant'
                  }`}
                >
                  <span className="block font-bold">{d.day}</span>
                  <span className="text-sm font-bold block mt-0.5">{d.num}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-sm flex-grow">
              
              {/* Monday column */}
              <div className="space-y-sm bg-white p-xs border border-outline-variant rounded-lg min-h-[350px]">
                <div className="p-sm bg-error/5 border-l-2 border-error rounded shadow-sm">
                  <div className="font-bold text-error text-[11px]">Rajesh K.</div>
                  <div className="text-[10px] text-on-surface-variant mt-0.5">08:30 • Call</div>
                </div>
                <div className="p-sm bg-orange-50 border-l-2 border-orange-500 rounded shadow-sm">
                  <div className="font-bold text-orange-700 text-[11px]">Emily T.</div>
                  <div className="text-[10px] text-on-surface-variant mt-0.5">10:30 • Message</div>
                </div>
                <div className="p-sm bg-primary/5 border-l-2 border-primary rounded shadow-sm">
                  <div className="font-bold text-primary text-[11px]">Marcus V.</div>
                  <div className="text-[10px] text-on-surface-variant mt-0.5">13:00 • Call</div>
                </div>
              </div>

              {/* Tuesday column */}
              <div className="bg-surface-container-low/30 border border-dashed border-outline-variant rounded-lg flex items-center justify-center text-on-surface-variant italic text-center p-md">
                No follow-ups scheduled
              </div>

              {/* Wednesday column */}
              <div className="space-y-sm bg-white p-xs border border-outline-variant rounded-lg">
                <div className="p-sm bg-primary/5 border-l-2 border-primary rounded shadow-sm">
                  <div className="font-bold text-primary text-[11px]">Suresh M.</div>
                  <div className="text-[10px] text-on-surface-variant mt-0.5">09:00 • SLA Audit</div>
                </div>
              </div>

              {/* Thursday - Sunday column placeholders */}
              <div className="bg-surface-container-low/30 border border-dashed border-outline-variant rounded-lg"></div>
              <div className="bg-surface-container-low/30 border border-dashed border-outline-variant rounded-lg"></div>
              <div className="bg-surface-container-low/30 border border-dashed border-outline-variant rounded-lg"></div>
              <div className="bg-surface-container-low/30 border border-dashed border-outline-variant rounded-lg"></div>

            </div>
          </div>
        )}

      </div>
    </main>
  );
};

export default DwCallbackCalendar;
