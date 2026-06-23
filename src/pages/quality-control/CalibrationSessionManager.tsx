import React, { useState } from 'react';

interface CalibrationEvent {
  id: string;
  day: number;
  title: string;
  attendees: number;
  callsReviewed?: number;
  time?: string;
  type: 'primary' | 'secondary' | 'sync';
}

export const CalibrationSessionManager: React.FC = () => {
  // Calendar View State
  const [currentView, setCurrentView] = useState<'Month' | 'Week' | 'Day'>('Month');
  const [currentMonth, setCurrentMonth] = useState('October 2023');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form Inputs
  const [sessionTitle, setSessionTitle] = useState('');
  const [sessionDay, setSessionDay] = useState(15);
  const [sessionAttendees, setSessionAttendees] = useState(3);
  const [sessionCalls, setSessionCalls] = useState(4);
  const [sessionTime, setSessionTime] = useState('14:00');

  // Events list
  const [events, setEvents] = useState<CalibrationEvent[]>([
    { id: '1', day: 4, title: 'Calibration: TL Rajesh', attendees: 3, callsReviewed: 4, type: 'primary' },
    { id: '2', day: 8, title: 'Calibration: TL Sameer', attendees: 2, type: 'secondary' },
    { id: '3', day: 12, title: 'Weekly TL Sync', attendees: 3, time: '14:00', type: 'sync' }
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => prev === 'October 2023' ? 'September 2023' : 'August 2023');
    triggerToast('Loaded previous month');
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => prev === 'October 2023' ? 'November 2023' : 'December 2023');
    triggerToast('Loaded next month');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionTitle) {
      triggerToast('Session Title is required');
      return;
    }
    const newEv: CalibrationEvent = {
      id: String(Date.now()),
      day: Number(sessionDay),
      title: sessionTitle,
      attendees: Number(sessionAttendees),
      callsReviewed: Number(sessionCalls),
      time: sessionTime,
      type: 'primary'
    };
    setEvents(prev => [...prev, newEv]);
    setShowCreateModal(false);
    setSessionTitle('');
    triggerToast(`Scheduled "${sessionTitle}" on Oct ${sessionDay} ✓`);
  };

  return (
    <main className="bg-white w-full max-w-7xl mx-auto p-6 space-y-6 relative text-xs md:text-sm">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs md:text-sm px-5 py-2.5 rounded-xl z-50 flex items-center gap-2 border border-slate-800 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-slate-200 rounded-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Calibration Session Manager</h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">Schedule, manage, and review collaborative calibration audits across teams.</p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Weekly Compliance */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">WEEKLY COMPLIANCE</h3>
            <p className="text-2xl md:text-3xl font-black text-slate-800">1 / 1 Sessions</p>
            <p className="text-xs text-green-600 font-bold mt-1">Goal Reached: 100%</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center bg-green-50 text-green-600">
            <span className="material-symbols-outlined text-2xl">check_circle</span>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">PENDING REVIEWS</h3>
            <p className="text-2xl md:text-3xl font-black text-slate-800">12 Calls</p>
            <p className="text-xs text-slate-450 mt-1">Ready for Calibration</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center bg-blue-50 text-blue-600">
            <span className="material-symbols-outlined text-2xl">assignment_turned_in</span>
          </div>
        </div>

        {/* Average Variance */}
        <div className="bg-white border border-slate-200 p-6 rounded-xl flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">AVERAGE VARIANCE</h3>
            <p className="text-2xl md:text-3xl font-black text-slate-800">4.2%</p>
            <p className="text-xs text-red-600 font-bold mt-1">High variance in Fatal Errors</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center bg-red-50 text-red-600">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
        </div>
      </div>

      {/* Date Navigation & Actions Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-xl">
        <div className="flex flex-wrap items-center gap-4">
          
          {/* View Toggler */}
          <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white text-xs font-bold">
            {(['Month', 'Week', 'Day'] as const).map(view => (
              <button 
                key={view}
                onClick={() => { setCurrentView(view); triggerToast(`Switched view to ${view}`); }}
                className={`px-4 py-2.5 transition-all ${currentView === view ? 'bg-amber-500 text-white font-extrabold' : 'text-slate-600 hover:bg-slate-50 border-r border-slate-100 last:border-r-0'}`}
              >
                {view}
              </button>
            ))}
          </div>
          
          {/* Date Picker Header */}
          <div className="flex items-center gap-2">
            <h3 className="text-sm md:text-base font-black text-slate-800">{currentMonth}</h3>
            <div className="flex gap-1">
              <button 
                onClick={handlePrevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all text-slate-650"
              >
                <span className="material-symbols-outlined text-sm md:text-base">chevron_left</span>
              </button>
              <button 
                onClick={handleNextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all text-slate-650"
              >
                <span className="material-symbols-outlined text-sm md:text-base">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Create Session Trigger */}
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-sm md:text-base">add</span>
          <span>Create Session</span>
        </button>
      </div>

      {/* Calendar Grid Sheet */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-slate-400 font-bold text-center text-xs">
          <div className="py-3 border-r border-slate-100">SUN</div>
          <div className="py-3 border-r border-slate-100">MON</div>
          <div className="py-3 border-r border-slate-100">TUE</div>
          <div className="py-3 border-r border-slate-100">WED</div>
          <div className="py-3 border-r border-slate-100">THU</div>
          <div className="py-3 border-r border-slate-100">FRI</div>
          <div className="py-3">SAT</div>
        </div>

        {/* Days Grid Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 border-t border-slate-100">
          
          {/* Previous month empty days */}
          <div className="min-h-[120px] bg-slate-50/50 p-2 opacity-40"></div>
          <div className="min-h-[120px] bg-slate-50/50 p-2 opacity-40"></div>
          <div className="min-h-[120px] bg-slate-50/50 p-2 opacity-40"></div>
          <div className="min-h-[120px] bg-slate-50/50 p-2 opacity-40"></div>
          <div className="min-h-[120px] bg-slate-50/50 p-2 opacity-40"></div>
          
          {/* Day 1 - 28 loops */}
          {Array.from({ length: 28 }).map((_, idx) => {
            const dayNum = idx + 1;
            const isToday = dayNum === 12;
            const dayEvents = events.filter(e => e.day === dayNum);

            return (
              <div 
                key={dayNum} 
                className={`min-h-[120px] p-2 flex flex-col justify-between transition-all ${
                  isToday ? 'bg-amber-50/10 ring-1 ring-inset ring-amber-500/20' : 'bg-white hover:bg-slate-50/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-black ${isToday ? 'text-amber-500 font-black' : 'text-slate-400'}`}>
                    {dayNum}
                  </span>
                  {isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  )}
                </div>

                {/* Event listings */}
                <div className="space-y-1.5 mt-2">
                  {dayEvents.map(ev => (
                    <div 
                      key={ev.id}
                      onClick={() => triggerToast(`Viewing details for: ${ev.title}`)}
                      className={`p-2 rounded-lg border text-[10px] md:text-xs font-bold cursor-pointer transition-all ${
                        ev.type === 'primary' 
                          ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600' 
                          : ev.type === 'secondary'
                          ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-150'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <p className="font-extrabold uppercase leading-tight truncate">{ev.title}</p>
                      {ev.time && <p className="text-[9px] mt-0.5 opacity-80">{ev.time}</p>}
                      <div className="flex items-center gap-1 text-[9px] mt-1 opacity-90">
                        <span className="material-symbols-outlined text-[10px]">group</span>
                        <span>{ev.attendees} Attendees</span>
                      </div>
                    </div>
                  ))}
                </div>

                {isToday && dayEvents.length === 0 && (
                  <p className="text-[10px] text-amber-500 font-bold italic mt-auto">Today</p>
                )}
                {!isToday && dayEvents.length === 0 && <div className="mt-auto"></div>}
              </div>
            );
          })}

        </div>
      </div>

      {/* CREATE SESSION MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 border border-slate-200">
            <h3 className="text-sm md:text-base font-bold uppercase mb-4 text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <span className="material-symbols-outlined text-amber-500">add_box</span>
              Create Calibration Session
            </h3>
            
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-slate-400 block mb-1 font-bold uppercase tracking-wider text-[10px]">Session Topic / Title</label>
                <input 
                  type="text" 
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  required
                  placeholder="e.g. Inbound Compliance Calibration"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 bg-slate-50 focus:bg-white focus:border-amber-500 text-xs md:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold uppercase tracking-wider text-[10px]">October Day (1-28)</label>
                  <input 
                    type="number" 
                    min="1"
                    max="28"
                    value={sessionDay}
                    onChange={(e) => setSessionDay(Number(e.target.value))}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 bg-slate-50 focus:bg-white focus:border-amber-500 text-xs md:text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-bold uppercase tracking-wider text-[10px]">Time</label>
                  <input 
                    type="time" 
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 bg-slate-50 focus:bg-white focus:border-amber-500 text-xs md:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold uppercase tracking-wider text-[10px]">Attendees Count</label>
                  <input 
                    type="number" 
                    value={sessionAttendees}
                    onChange={(e) => setSessionAttendees(Number(e.target.value))}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 bg-slate-50 focus:bg-white focus:border-amber-500 text-xs md:text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-bold uppercase tracking-wider text-[10px]">Calls to Review</label>
                  <input 
                    type="number" 
                    value={sessionCalls}
                    onChange={(e) => setSessionCalls(Number(e.target.value))}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 bg-slate-50 focus:bg-white focus:border-amber-500 text-xs md:text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
};

export default CalibrationSessionManager;
