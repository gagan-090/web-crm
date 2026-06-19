import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CallbackEvent {
  id: string;
  name: string;
  tmid: string;
  time: string;
  date: string; // YYYY-MM-DD
  urgency: 'overdue' | 'soon' | 'today' | 'future';
  city: string;
  state: string;
  phone: string;
  vehicleType: string;
  licenseType: string;
  experience: string;
  preferredRoute: string;
  notes: string;
}

export const DwCallbackCalendar: React.FC = () => {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedEventId, setSelectedEventId] = useState<string | null>('E1');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add callback modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchLeadQuery, setSearchLeadQuery] = useState('');
  const [newDate, setNewDate] = useState('2026-06-20');
  const [newTime, setNewTime] = useState('14:30');
  const [newNote, setNewNote] = useState('');

  // Sample data: Today is June 19, 2026 (Friday)
  const todayStr = '2026-06-19';

  const [callbacks, setCallbacks] = useState<CallbackEvent[]>([
    {
      id: 'E1',
      name: 'Suresh Yadav',
      tmid: 'DR-48291',
      time: '11:30 AM',
      date: '2026-06-19', // Today
      urgency: 'overdue',
      city: 'Agra',
      state: 'Uttar Pradesh',
      phone: '+91-98765-43210',
      vehicleType: 'Heavy Truck',
      licenseType: 'HMV',
      experience: '6 years',
      preferredRoute: 'Delhi–Agra',
      notes: 'Wants to review Verified Plan price details.'
    },
    {
      id: 'E2',
      name: 'Rajesh Kumar',
      tmid: 'DR-48292',
      time: '12:30 PM',
      date: '2026-06-19', // Today
      urgency: 'soon', // within 1h
      city: 'Bhiwandi',
      state: 'Maharashtra',
      phone: '+91-98123-45678',
      vehicleType: 'Tata Ace',
      licenseType: 'LMV',
      experience: '3 years',
      preferredRoute: 'Mumbai–Pune',
      notes: 'Needs help uploading driving license photo.'
    },
    {
      id: 'E3',
      name: 'Amit Singh',
      tmid: 'DR-48293',
      time: '03:00 PM',
      date: '2026-06-19', // Today
      urgency: 'today', // scheduled today
      city: 'Patna',
      state: 'Bihar',
      phone: '+91-88888-88888',
      vehicleType: 'E-Rickshaw Cargo',
      licenseType: 'LMV',
      experience: '2 years',
      preferredRoute: 'Patna Local',
      notes: 'Call to complete subscription onboarding.'
    },
    {
      id: 'E4',
      name: 'Mahendra Singh',
      tmid: 'DR-48294',
      time: '10:00 AM',
      date: '2026-06-20', // Tomorrow
      urgency: 'future',
      city: 'Jaipur',
      state: 'Rajasthan',
      phone: '+91-77777-77777',
      vehicleType: 'Heavy Truck',
      licenseType: 'HMV',
      experience: '8 years',
      preferredRoute: 'Jaipur–Delhi',
      notes: 'Clear queries about regional load counts.'
    }
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const selectedEvent = callbacks.find(e => e.id === selectedEventId) || callbacks[0];

  // Urgency Style Maps
  const getTileStyle = (urgency: string) => {
    switch (urgency) {
      case 'overdue':
        return 'bg-red-50 border-l-4 border-red-500 text-red-700 hover:bg-red-100/70';
      case 'soon':
        return 'bg-orange-50 border-l-4 border-orange-500 text-orange-700 hover:bg-orange-100/70';
      case 'today':
        return 'bg-blue-50 border-l-4 border-blue-500 text-blue-700 hover:bg-blue-100/70';
      default:
        return 'bg-gray-50 border-l-4 border-gray-400 text-gray-700 hover:bg-gray-100/70';
    }
  };

  const handleSaveCallback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLeadQuery) {
      triggerToast('Please enter a lead name or TMID');
      return;
    }
    const newCb: CallbackEvent = {
      id: `E${Date.now()}`,
      name: searchLeadQuery,
      tmid: 'DR-99088',
      time: newTime,
      date: newDate,
      urgency: newDate === todayStr ? 'today' : 'future',
      city: 'Agra',
      state: 'Uttar Pradesh',
      phone: '+91-99999-99999',
      vehicleType: 'Heavy Truck',
      licenseType: 'HMV',
      experience: '5 years',
      preferredRoute: 'Delhi-Agra',
      notes: newNote
    };
    setCallbacks(prev => [...prev, newCb]);
    setShowAddModal(false);
    triggerToast('Callback Scheduled successfully!');
    setSearchLeadQuery('');
    setNewNote('');
  };

  // Navigate to Call Page
  const handleCallNow = (lead: CallbackEvent) => {
    navigate('/dw/dw-active-call-focus', {
      state: {
        leadId: lead.id,
        tmid: lead.tmid,
        name: lead.name,
        phone: lead.phone,
        location: `${lead.city}, ${lead.state}`,
        vehicleType: lead.vehicleType,
        licenseType: lead.licenseType,
        experience: lead.experience,
        preferredRoute: lead.preferredRoute,
        history: [],
        notes: lead.notes
      }
    });
  };

  return (
    <main className="h-[calc(100vh-80px)] flex bg-white overflow-hidden border border-gray-200 rounded-xl relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#27AE60]"></span>
          {toastMessage}
        </div>
      )}

      {/* Main Left Panel Calendar View */}
      <section className="flex-1 flex flex-col min-w-0 border-r border-gray-200">
        
        {/* Overdue Banner */}
        {callbacks.some(c => c.urgency === 'overdue') && (
          <div className="bg-[#FDEDEC] border-b border-red-200 px-4 py-2 text-xs font-bold text-red-600 flex justify-between items-center shrink-0">
            <span>⚠️ {callbacks.filter(c => c.urgency === 'overdue').length} callbacks overdue — Please attend immediately</span>
            <button 
              onClick={() => triggerToast('Loading overdue filters...')}
              className="underline text-[11px] hover:text-red-800"
            >
              [view list]
            </button>
          </div>
        )}

        {/* View Switcher Top Bar */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center shrink-0">
          <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Callback Calendar</h2>
          <div className="flex bg-white border border-gray-200 rounded-lg p-0.5 select-none">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-all ${viewMode === 'week' ? 'bg-[#27AE60] text-white' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 text-xs font-semibold rounded transition-all ${viewMode === 'day' ? 'bg-[#27AE60] text-white' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Day View
            </button>
          </div>
        </div>

        {/* Calendar Grid Canvas */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0 bg-gray-50/20">
          {viewMode === 'week' ? (
            /* WEEK VIEW */
            <div className="grid grid-cols-7 gap-3 h-full min-h-[400px]">
              {[
                { day: 'Mon', date: '2026-06-15', label: '15 Jun' },
                { day: 'Tue', date: '2026-06-16', label: '16 Jun' },
                { day: 'Wed', date: '2026-06-17', label: '17 Jun' },
                { day: 'Thu', date: '2026-06-18', label: '18 Jun' },
                { day: 'Fri', date: '2026-06-19', label: 'Today', isToday: true },
                { day: 'Sat', date: '2026-06-20', label: '20 Jun' },
                { day: 'Sun', date: '2026-06-21', label: '21 Jun' }
              ].map(col => {
                const dayCallbacks = callbacks.filter(c => c.date === col.date);
                return (
                  <div 
                    key={col.date} 
                    className={`rounded-xl border flex flex-col p-2 bg-white min-h-[360px] transition-colors ${
                      col.isToday ? 'border-[#27AE60] ring-1 ring-[#27AE60]/20 bg-[#EAFAF1]/5' : 'border-gray-200'
                    }`}
                  >
                    <div className="text-center pb-2 mb-2 border-b border-gray-100">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">{col.day}</span>
                      <span className={`inline-block text-xs font-bold px-1.5 py-0.5 rounded-full mt-0.5 ${
                        col.isToday ? 'bg-[#27AE60] text-white' : 'text-gray-700'
                      }`}>
                        {col.label}
                      </span>
                    </div>

                    <div className="flex-grow space-y-2 overflow-y-auto min-h-0 pb-2">
                      {dayCallbacks.map(cb => (
                        <div
                          key={cb.id}
                          onClick={() => setSelectedEventId(cb.id)}
                          className={`p-2 rounded-lg border text-xs cursor-pointer transition-all shadow-sm ${getTileStyle(cb.urgency)} ${
                            cb.id === selectedEventId ? 'ring-1 ring-offset-1 ring-gray-400 font-medium' : ''
                          }`}
                        >
                          <div className="font-bold truncate">{cb.name}</div>
                          <div className="text-[10px] opacity-80 mt-0.5">{cb.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* DAY VIEW TIMELINE */
            <div className="bg-white border border-gray-200 rounded-xl p-4 min-h-[500px] relative max-w-3xl mx-auto">
              <div className="text-xs font-bold text-gray-500 mb-4 flex justify-between">
                <span>Friday, June 19, 2026 (Today)</span>
                <span className="text-[#27AE60]">3 Callbacks scheduled</span>
              </div>
              
              <div className="relative pl-16 space-y-4 before:absolute before:left-14 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                {['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'].map((timeLabel, idx) => {
                  // Find mock callbacks matching hours
                  const matches = callbacks.filter(c => c.date === todayStr && c.time.toLowerCase().includes(timeLabel.slice(0,2).toLowerCase()));
                  return (
                    <div key={idx} className="relative py-2">
                      <span className="absolute left-0 top-3 font-mono text-[10px] text-gray-400">{timeLabel}</span>
                      
                      <div className="space-y-2 pl-4">
                        {matches.map(cb => (
                          <div
                            key={cb.id}
                            onClick={() => setSelectedEventId(cb.id)}
                            className={`p-3 rounded-lg border text-xs cursor-pointer shadow-sm ${getTileStyle(cb.urgency)}`}
                          >
                            <div className="font-bold text-sm">{cb.name} ({cb.tmid})</div>
                            <div className="text-[11px] opacity-90 mt-1">Scheduled at {cb.time} · {cb.notes}</div>
                          </div>
                        ))}
                        {matches.length === 0 && (
                          <div className="text-gray-300 text-xs italic pl-2 py-1">No callbacks scheduled</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Add Callback Floating Action Button */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="absolute right-4 bottom-4 w-12 h-12 bg-[#27AE60] hover:bg-[#219653] text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 z-20"
          title="Add Callback"
        >
          <span className="material-symbols-outlined text-2xl font-bold">add</span>
        </button>

      </section>

      {/* Right Column Lead Detail Viewer (Same right-panel component as Call Queue) */}
      <section className="w-[360px] bg-white flex flex-col shrink-0 overflow-hidden">
        {selectedEvent ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Header info */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base">{selectedEvent.name}</h3>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">{selectedEvent.tmid} · DRIVER</p>
              <p className="text-xs text-gray-400 mt-1">{selectedEvent.city}, {selectedEvent.state}</p>
            </div>

            {/* Profile grid */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-150 space-y-2">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Driver Qualifications</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-gray-400 block">Vehicle:</span>
                    <span className="font-bold text-gray-700">{selectedEvent.vehicleType}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">License:</span>
                    <span className="font-bold text-gray-700">{selectedEvent.licenseType}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Experience:</span>
                    <span className="font-bold text-gray-700">{selectedEvent.experience}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Route:</span>
                    <span className="font-bold text-gray-700">{selectedEvent.preferredRoute}</span>
                  </div>
                </div>
              </div>

              {/* Callback details & notes */}
              <div className="space-y-1.5">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Callback Note</div>
                <div className="bg-[#FFF9E6] border border-[#F2C94C] p-3 rounded-lg text-gray-700 text-xs italic">
                  "{selectedEvent.notes}"
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Schedule Metadata</div>
                <div className="text-[11px] text-gray-600 bg-gray-100 p-2.5 rounded">
                  Scheduled for: {selectedEvent.date} at {selectedEvent.time}
                </div>
              </div>
            </div>

            {/* Footer Call Trigger Actions */}
            <div className="p-4 border-t border-gray-150 bg-white">
              <button 
                onClick={() => handleCallNow(selectedEvent)}
                className="w-full bg-[#27AE60] hover:bg-[#219653] text-white h-11 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">phone</span> Call Now
              </button>
            </div>

          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center p-4 text-center text-gray-400 italic text-xs">
            Select a calendar callback event block to display lead details cockpit.
          </div>
        )}
      </section>

      {/* ADD CALLBACK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Add Callback Event</h3>
            
            <form onSubmit={handleSaveCallback} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-500 block mb-1 font-semibold">Lead Search (Name / TMID)</label>
                <input 
                  type="text" 
                  value={searchLeadQuery} 
                  onChange={(e) => setSearchLeadQuery(e.target.value)}
                  placeholder="e.g. Suresh Yadav or DR-48291"
                  required
                  className="w-full border border-gray-200 rounded px-2.5 py-1.5 outline-none font-semibold text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-500 block mb-1 font-semibold">Select Date</label>
                  <input 
                    type="date" 
                    value={newDate} 
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded px-2 py-1.5 outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1 font-semibold">Select Time</label>
                  <input 
                    type="time" 
                    value={newTime} 
                    onChange={(e) => setNewTime(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded px-2 py-1.5 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-500 block mb-1 font-semibold">Interaction Remarks</label>
                <textarea 
                  value={newNote} 
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="What should the caller know for this callback?"
                  rows={2}
                  className="w-full border border-gray-200 rounded px-2.5 py-1.5 outline-none resize-none"
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
                  className="px-4 py-2 bg-[#27AE60] hover:bg-[#219653] text-white rounded font-bold transition-all shadow-sm"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
};

export default DwCallbackCalendar;
