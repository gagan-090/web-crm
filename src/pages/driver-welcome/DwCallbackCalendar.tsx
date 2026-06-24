import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useGetDwCallbacksQuery, 
  useGetDwLeadDetailQuery,
  useScheduleDwCallbackMutation 
} from '../../services/api/webCrmApi';

export const DwCallbackCalendar: React.FC = () => {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedEventId, setSelectedEventId] = useState<number | string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add callback modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchLeadId, setSearchLeadId] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('12:00');
  const [newNote, setNewNote] = useState('');

  const { data: callbacksResponse, isLoading: isCallbacksLoading, refetch } = useGetDwCallbacksQuery();
  const [scheduleDwCallback] = useScheduleDwCallbackMutation();

  const callbacks = callbacksResponse?.data || [];

  useEffect(() => {
    if (callbacks.length > 0 && !selectedEventId) {
      setSelectedEventId(callbacks[0].id);
    }
  }, [callbacks, selectedEventId]);

  const selectedEvent = callbacks.find(c => c.id === selectedEventId);

  const { data: detailResponse } = useGetDwLeadDetailQuery(
    // The details query expects a userId (integer/string). Since selectedEvent has user_id, we use it, falling back to id.
    selectedEvent ? (selectedEvent.user_id ?? selectedEvent.id) : '',
    { skip: !selectedEvent }
  );

  const driverProfile = detailResponse?.data?.profile;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper to dynamically calculate current week's dates
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon...
    const mondayDiff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(mondayDiff + i);
      const dateStr = date.toISOString().split('T')[0];
      const isToday = date.toDateString() === today.toDateString();
      const label = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      dates.push({ day: days[i], date: dateStr, label: isToday ? 'Today' : label, isToday });
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const handleSaveCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLeadId) {
      triggerToast('Please enter a driver ID / user_id');
      return;
    }
    try {
      await scheduleDwCallback({
        user_id: Number(searchLeadId),
        reason: `${newNote} (Scheduled for ${newDate} ${newTime})`
      }).unwrap();

      triggerToast('Callback Scheduled successfully!');
      setShowAddModal(false);
      setSearchLeadId('');
      setNewNote('');
      refetch();
    } catch (err) {
      triggerToast('Failed to schedule callback. Check if driver ID is correct.');
    }
  };

  const handleCallNow = (cb: any) => {
    navigate('/dw/dw-active-call-focus', {
      state: {
        userId: cb.id, // the callback id contains the call history or user relation
        tmid: cb.tmid,
        name: cb.name,
        mobile: cb.mobile
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
      <section className="flex-1 flex flex-col min-w-0 border-r border-gray-200 relative">
        
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
          {isCallbacksLoading ? (
            <div className="p-8 text-center text-xs text-gray-500">Loading callbacks...</div>
          ) : viewMode === 'week' ? (
            /* WEEK VIEW */
            <div className="grid grid-cols-7 gap-3 h-full min-h-[400px]">
              {weekDates.map(col => {
                // filter callbacks whose scheduled_for starts with the column date string
                const dayCallbacks = callbacks.filter(c => c.scheduled_for.startsWith(col.date));
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
                          className={`p-2 rounded-lg border text-xs cursor-pointer transition-all shadow-sm bg-orange-50 border-l-4 border-orange-500 text-orange-700 hover:bg-orange-100/70 ${
                            cb.id === selectedEventId ? 'ring-1 ring-offset-1 ring-gray-400 font-medium' : ''
                          }`}
                        >
                          <div className="font-bold truncate">{cb.name}</div>
                          <div className="text-[10px] opacity-80 mt-0.5">
                            {new Date(cb.scheduled_for).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
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
                <span>Today's Callbacks</span>
                <span className="text-[#27AE60]">{callbacks.length} scheduled</span>
              </div>
              
              <div className="relative pl-16 space-y-4 before:absolute before:left-14 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                {callbacks.map(cb => (
                  <div 
                    key={cb.id} 
                    onClick={() => setSelectedEventId(cb.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer shadow-sm bg-blue-50 border-l-4 border-blue-500 text-blue-700 hover:bg-blue-100/70 ${
                      cb.id === selectedEventId ? 'ring-1 ring-offset-1 ring-gray-400 font-medium' : ''
                    }`}
                  >
                    <div className="font-bold text-sm">{cb.name} ({cb.tmid})</div>
                    <div className="text-[11px] opacity-90 mt-1">
                      Due at: {new Date(cb.scheduled_for).toLocaleString()} · {cb.reason}
                    </div>
                  </div>
                ))}
                {callbacks.length === 0 && (
                  <div className="text-gray-300 text-xs italic pl-2 py-4">No callbacks scheduled.</div>
                )}
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

      {/* Right Column Lead Detail Viewer */}
      <section className="w-[360px] bg-white flex flex-col shrink-0 overflow-hidden">
        {selectedEvent ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Header info */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base">{selectedEvent.name}</h3>
              <p className="text-xs text-gray-500 font-semibold mt-0.5">{selectedEvent.tmid} · DRIVER</p>
              <p className="text-xs text-gray-400 mt-1">{selectedEvent.city}</p>
            </div>

            {/* Profile grid */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-150 space-y-2">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Driver Details</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-gray-400 block">Mobile:</span>
                    <span className="font-bold text-gray-700">{selectedEvent.mobile}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Vehicle Type:</span>
                    <span className="font-bold text-gray-700">{driverProfile?.vehicle_type || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Callback details & notes */}
              <div className="space-y-1.5">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Callback Note</div>
                <div className="bg-[#FFF9E6] border border-[#F2C94C] p-3 rounded-lg text-gray-700 text-xs italic">
                  "{selectedEvent.reason}"
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Schedule Metadata</div>
                <div className="text-[11px] text-gray-600 bg-gray-100 p-2.5 rounded">
                  Scheduled for: {new Date(selectedEvent.scheduled_for).toLocaleString()}
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
                <label className="text-gray-500 block mb-1 font-semibold">Driver ID (User Database Primary Key)</label>
                <input 
                  type="number" 
                  value={searchLeadId} 
                  onChange={(e) => setSearchLeadId(e.target.value)}
                  placeholder="e.g. 5"
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
                  placeholder="Callback reason..."
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
