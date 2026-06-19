import React, { useState } from 'react';

interface CallbackEvent {
  id: string;
  caller: string;
  leadName: string;
  time: string; // e.g. "09:00 AM"
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  isOverdue?: boolean;
  color: string; // border/bg tailwind classes
}

export const TlTeamCallbackCalendar: React.FC = () => {
  const [tlMode, setTlMode] = useState<'dw' | 'tr-mm'>('dw');
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week');
  const [selectedCallers, setSelectedCallers] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Add Callback form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCaller, setNewCaller] = useState('');
  const [newLeadName, setNewLeadName] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newDay, setNewDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'>('Mon');
  const [newReason, setNewReason] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Callers list per mode
  const dwCallers = ['Rahul S.', 'Sonia R.', 'Aman K.', 'Priya P.', 'Vikram A.', 'Aditi S.'];
  const trCallers = ['Alex R.', 'Sarah C.', 'Marcus T.', 'Rohit K.', 'Sneha M.', 'Javed K.'];
  const currentCallers = tlMode === 'dw' ? dwCallers : trCallers;

  // Initialize selected callers when switching modes
  React.useEffect(() => {
    setSelectedCallers(currentCallers);
  }, [tlMode]);

  // Callback events per mode
  const [dwEvents, setDwEvents] = useState<CallbackEvent[]>([
    { id: 'e1', caller: 'Rahul S.', leadName: 'Suresh Yadav (DR-48291)', time: '09:00 AM', day: 'Mon', isOverdue: true, color: 'border-l-teal-500 bg-teal-50/50' },
    { id: 'e2', caller: 'Sonia R.', leadName: 'Amit Singh (DR-48292)', time: '11:00 AM', day: 'Tue', color: 'border-l-indigo-500 bg-indigo-50/50' },
    { id: 'e3', caller: 'Aman K.', leadName: 'Ramesh Kumar (DR-48293)', time: '11:00 AM', day: 'Tue', color: 'border-l-emerald-500 bg-emerald-50/50' }, // Conflict: Aman K & Sonia R both booked at 11:00 AM Tue
    { id: 'e4', caller: 'Priya P.', leadName: 'Vikram Rathore (DR-48294)', time: '02:00 PM', day: 'Wed', color: 'border-l-pink-500 bg-pink-50/50' },
    { id: 'e5', caller: 'Aditi S.', leadName: 'Harpreet Singh (DR-48297)', time: '04:00 PM', day: 'Thu', color: 'border-l-purple-500 bg-purple-50/50' }
  ]);

  const [trEvents, setTrEvents] = useState<CallbackEvent[]>([
    { id: 'e6', caller: 'Alex R.', leadName: 'Agrawal Global (TR-12094)', time: '09:30 AM', day: 'Mon', isOverdue: true, color: 'border-l-teal-500 bg-teal-50/50' },
    { id: 'e7', caller: 'Sarah C.', leadName: 'Kunal Logistics (TR-12095)', time: '10:30 AM', day: 'Tue', color: 'border-l-indigo-500 bg-indigo-50/50' },
    { id: 'e8', caller: 'Marcus T.', leadName: 'Sharma Logistics (TR-12096)', time: '10:30 AM', day: 'Tue', color: 'border-l-rose-500 bg-rose-50/50' }, // Conflict
    { id: 'e9', caller: 'Rohit K.', leadName: 'Gati Agent Delhi (TR-12097)', time: '02:30 PM', day: 'Wed', color: 'border-l-purple-500 bg-purple-50/50' },
    { id: 'e10', caller: 'Sneha M.', leadName: 'VRL Logistics Hub (TR-12098)', time: '04:00 PM', day: 'Thu', color: 'border-l-pink-500 bg-pink-50/50' }
  ]);

  const currentEvents = tlMode === 'dw' ? dwEvents : trEvents;
  const setEvents = tlMode === 'dw' ? setDwEvents : setTrEvents;

  // Toggle Caller filter
  const handleToggleCaller = (caller: string) => {
    setSelectedCallers(prev => 
      prev.includes(caller) ? prev.filter(c => c !== caller) : [...prev, caller]
    );
  };

  // Filter events based on selected callers
  const filteredEvents = currentEvents.filter(e => selectedCallers.includes(e.caller));

  // Missed Callbacks
  const overdueEvents = currentEvents.filter(e => e.isOverdue);

  // Check conflicts (duplicate bookings at the same day & time for the active callers)
  const getConflictId = (event: CallbackEvent) => {
    const matches = filteredEvents.filter(e => e.day === event.day && e.time === event.time && e.id !== event.id);
    return matches.length > 0;
  };

  // Resolve Overdue Callback
  const handleResolveOverdue = (id: string, leadName: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, isOverdue: false } : e));
    triggerToast(`Resolved overdue callback for ${leadName} ✓`);
  };

  // Submit new callback
  const handleAddCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaller || !newLeadName || !newReason.trim()) {
      triggerToast('All fields are required to schedule a callback');
      return;
    }

    const colorClasses = [
      'border-l-teal-500 bg-teal-50/50',
      'border-l-indigo-500 bg-indigo-50/50',
      'border-l-emerald-500 bg-emerald-50/50',
      'border-l-pink-500 bg-pink-50/50',
      'border-l-purple-500 bg-purple-50/50',
      'border-l-amber-500 bg-amber-50/50'
    ];
    const randomIndex = Math.floor(Math.random() * colorClasses.length);

    const newEv: CallbackEvent = {
      id: 'e_' + Date.now(),
      caller: newCaller,
      leadName: newLeadName,
      time: newTime,
      day: newDay,
      color: colorClasses[randomIndex]
    };

    setEvents(prev => [...prev, newEv]);
    setShowAddModal(false);
    setNewLeadName('');
    setNewReason('');
    triggerToast(`Scheduled callback for ${newLeadName} on ${newDay} at ${newTime} ✓`);
  };

  // Render hourly schedule block
  const times = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
  const days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <main className="flex flex-col h-[calc(100vh-60px)] bg-white overflow-hidden relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#F39C12]"></span>
          {toastMessage}
        </div>
      )}

      {/* Critical Overdue Bar */}
      {overdueEvents.length > 0 && (
        <div className="bg-red-50 border-b border-red-200 text-red-700 px-4 py-2.5 flex items-center justify-between shrink-0 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-red-600 text-[18px]">warning</span>
            <span>CRITICAL: {overdueEvents.length} Overdue Callbacks require supervisor routing.</span>
          </div>
          <div className="flex items-center gap-2">
            {overdueEvents.map(ev => (
              <button 
                key={ev.id}
                onClick={() => handleResolveOverdue(ev.id, ev.leadName)}
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded text-[10px] font-bold"
              >
                Resolve {ev.caller} ({ev.day})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Header controls strip */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide">TL Team Callback Calendar</h1>
            <p className="text-[10px] text-gray-400">Manage agent appointments and resolve scheduling conflicts</p>
          </div>

          <div className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 text-xs">
            <button 
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded font-bold ${viewMode === 'day' ? 'bg-[#F39C12] text-white' : 'text-gray-500'}`}
            >
              Day
            </button>
            <button 
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded font-bold ${viewMode === 'week' ? 'bg-[#F39C12] text-white' : 'text-gray-500'}`}
            >
              Week
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <button
            onClick={() => {
              const nextMode = tlMode === 'dw' ? 'tr-mm' : 'dw';
              setTlMode(nextMode);
              triggerToast(`Switched calendar to ${nextMode === 'dw' ? 'Driver Welcome' : 'Transporter + Matchmaking'}`);
            }}
            className="bg-white border border-gray-200 hover:border-[#F39C12] text-gray-700 px-3 py-1 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">swap_horiz</span>
            <span>Role: {tlMode === 'dw' ? 'Driver Welcome' : 'Transporter+MM'}</span>
          </button>

          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#F39C12] hover:bg-[#e08e0b] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Schedule Callback</span>
          </button>
        </div>
      </div>

      {/* Grid workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Filter Pane */}
        <aside className="w-56 border-r border-gray-200 p-4 bg-gray-50/50 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide border-b border-gray-200 pb-2">
              Caller Filters
            </h3>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Show Callers:</label>
              <div className="space-y-1.5">
                {currentCallers.map(caller => {
                  const isChecked = selectedCallers.includes(caller);
                  return (
                    <label key={caller} className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={() => handleToggleCaller(caller)}
                        className="rounded border-gray-300 text-[#F39C12] focus:ring-[#F39C12]"
                      />
                      <span>{caller}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4 text-[10px] text-gray-400 leading-normal space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-orange-100 border border-orange-300"></span>
              <span>Filter Active / Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-red-100 border border-red-300"></span>
              <span>SLA Conflict / Overdue</span>
            </div>
          </div>
        </aside>

        {/* Calendar Grid Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Days Header */}
          <div className="grid grid-cols-8 border-b border-gray-200 text-center text-xs font-bold text-gray-600 bg-gray-50 shrink-0 select-none">
            <div className="py-2.5 border-r border-gray-200">Time</div>
            {viewMode === 'week' ? (
              days.map(d => (
                <div key={d} className="py-2.5 border-r border-gray-250 last:border-r-0 uppercase text-[10px] tracking-wider text-gray-400">
                  {d}
                </div>
              ))
            ) : (
              <div className="col-span-7 py-2.5 uppercase text-[10px] tracking-wider text-[#D35400]">
                Today (Monday)
              </div>
            )}
          </div>

          {/* Time Rows Scrollable grid */}
          <div className="flex-1 overflow-y-auto">
            {times.map(t => (
              <div key={t} className="grid grid-cols-8 border-b border-gray-100 min-h-[72px]">
                {/* Time column label */}
                <div className="p-2 border-r border-gray-200 text-[10.5px] font-mono text-gray-400 text-right pr-3 select-none">
                  {t}
                </div>

                {/* Day Columns */}
                {viewMode === 'week' ? (
                  days.map(d => {
                    const cellEvents = filteredEvents.filter(e => e.day === d && e.time.startsWith(t.split(':')[0]));
                    return (
                      <div key={d} className="border-r border-gray-150 last:border-r-0 p-1.5 relative space-y-1 bg-gray-50/10">
                        {cellEvents.map(ev => {
                          const hasConflict = getConflictId(ev);
                          return (
                            <div 
                              key={ev.id}
                              className={`p-1.5 rounded border border-l-4 shadow-sm text-[10px] leading-tight select-none relative ${ev.color} ${
                                hasConflict ? 'border-red-400 ring-2 ring-red-100 animate-pulse' : ''
                              } ${ev.isOverdue ? 'bg-red-50 text-red-900 border-red-500' : ''}`}
                            >
                              <div className="font-extrabold text-gray-800 flex justify-between items-start gap-1">
                                <span className="truncate">{ev.leadName.split(' ')[0]}</span>
                                {hasConflict && (
                                  <span className="material-symbols-outlined text-[13px] text-red-600 font-bold" title="Conflict!">warning</span>
                                )}
                              </div>
                              <div className="text-[9px] text-gray-500 font-semibold mt-1 flex justify-between">
                                <span>{ev.caller}</span>
                                <span className="font-mono text-gray-400">{ev.time.replace(':00 ', ' ')}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })
                ) : (
                  // Day view (Monday columns)
                  <div className="col-span-7 p-2 grid grid-cols-3 gap-2">
                    {filteredEvents.filter(e => e.day === 'Mon' && e.time.startsWith(t.split(':')[0])).map(ev => {
                      const hasConflict = getConflictId(ev);
                      return (
                        <div 
                          key={ev.id}
                          className={`p-2 rounded border border-l-4 shadow-sm text-[10.5px] leading-tight ${ev.color} ${
                            hasConflict ? 'border-red-400 ring-2 ring-red-100' : ''
                          }`}
                        >
                          <div className="font-bold text-gray-850 flex justify-between items-center">
                            <span>{ev.leadName}</span>
                            {hasConflict && (
                              <span className="material-symbols-outlined text-xs text-red-600 font-bold">warning</span>
                            )}
                          </div>
                          <div className="text-[9.5px] text-gray-450 mt-1 flex justify-between">
                            <span>Caller: {ev.caller}</span>
                            <span className="font-mono">{ev.time}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SCHEDULE CALLBACK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-gray-100 text-xs">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-1">
              <span className="material-symbols-outlined text-[#F39C12]">calendar_today</span>
              Schedule Agent Callback
            </h3>

            <form onSubmit={handleAddCallbackSubmit} className="space-y-4">
              <div>
                <label className="text-gray-500 block mb-1 font-semibold">Assign Caller Agent</label>
                <select 
                  value={newCaller}
                  onChange={(e) => setNewCaller(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded px-2.5 py-1.5 bg-white outline-none font-semibold text-gray-800"
                >
                  <option value="">Select Caller...</option>
                  {currentCallers.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-500 block mb-1 font-semibold">Customer / Lead Name</label>
                <input 
                  type="text" 
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  required
                  placeholder="e.g. Rahul Singh (DR-12045)"
                  className="w-full border border-gray-200 rounded px-2.5 py-1.5 outline-none font-medium text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-500 block mb-1 font-semibold">Scheduled Day</label>
                  <select 
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as any)}
                    className="w-full border border-gray-200 rounded px-2.5 py-1.5 bg-white outline-none font-semibold text-gray-800"
                  >
                    {days.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-gray-500 block mb-1 font-semibold">Scheduled Time</label>
                  <select 
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full border border-gray-200 rounded px-2.5 py-1.5 bg-white outline-none font-semibold text-gray-800"
                  >
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-500 block mb-1 font-semibold">Operational Reason</label>
                <textarea 
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  required
                  placeholder="Justification for manual callback booking on behalf of agent..."
                  rows={2}
                  className="w-full border border-gray-200 rounded px-2.5 py-1.5 outline-none font-medium text-gray-800 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 rounded font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#F39C12] hover:bg-[#e08e0b] text-white rounded font-bold shadow-sm"
                >
                  Schedule Callback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
};

export default TlTeamCallbackCalendar;
