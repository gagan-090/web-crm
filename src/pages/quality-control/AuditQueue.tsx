import React, { useState, useEffect } from 'react';
import { useGetQcQueueQuery, useSubmitQcAuditMutation } from '../../services/api/webCrmApi';

interface CallRecord {
  id: number;
  tmid: string;
  name: string;
  phone: string;
  duration: string;
  timestamp: string;
  callerName: string;
  process: string;
  recordingUrl: string;
  isAudited: boolean;
  score: number | null;
  isFatal: boolean;
}

export const AuditQueue: React.FC = () => {
  const { data: realQueueData, refetch } = useGetQcQueueQuery();
  const [submitAudit] = useSubmitQcAuditMutation();

  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Scorecard state
  const [greetingScore, setGreetingScore] = useState(20);
  const [objectionScore, setObjectionScore] = useState(20);
  const [scriptScore, setScriptScore] = useState(20);
  const [closingScore, setClosingScore] = useState(20);
  const [feedback, setFeedback] = useState('');
  const [isFatal, setIsFatal] = useState(false);

  // Audio playing state
  const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (realQueueData?.queue && realQueueData.queue.length > 0) {
      setCalls(realQueueData.queue);
    } else {
      setCalls([
        { id: 1, tmid: 'DR-88291', name: 'Ramesh Kumar', phone: '+91 9988776655', duration: '2m 15s', timestamp: '24 Jun 2026, 11:30 AM', callerName: 'Rahul S.', process: 'Driver Welcome', recordingUrl: 'https://www.w3schools.com/html/horse.mp3', isAudited: false, score: null, isFatal: false },
        { id: 2, tmid: 'DR-48292', name: 'Amit Singh', phone: '+91 8877665544', duration: '1m 45s', timestamp: '24 Jun 2026, 10:15 AM', callerName: 'Priya V.', process: 'Driver Welcome', recordingUrl: 'https://www.w3schools.com/html/horse.mp3', isAudited: true, score: 85, isFatal: false },
        { id: 3, tmid: 'TR-10021', name: 'Anand Transport', phone: '+91 7766554433', duration: '3m 10s', timestamp: '23 Jun 2026, 04:45 PM', callerName: 'Rahul S.', process: 'Transporter Welcome', recordingUrl: 'https://www.w3schools.com/html/horse.mp3', isAudited: true, score: 58, isFatal: true },
        { id: 4, tmid: 'DR-88250', name: 'Sneha L.', phone: '+91 6655443322', duration: '2m 05s', timestamp: '23 Jun 2026, 02:30 PM', callerName: 'Sneha L.', process: 'Driver Welcome', recordingUrl: 'https://www.w3schools.com/html/horse.mp3', isAudited: false, score: null, isFatal: false }
      ]);
    }
  }, [realQueueData]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePlayAudio = (callId: number, url: string) => {
    if (playingAudioId === callId) {
      audioElement?.pause();
      setPlayingAudioId(null);
    } else {
      if (audioElement) {
        audioElement.pause();
      }
      const audio = new Audio(url);
      audio.play();
      audio.onended = () => setPlayingAudioId(null);
      setAudioElement(audio);
      setPlayingAudioId(callId);
    }
  };

  const openAuditModal = (call: CallRecord) => {
    setSelectedCall(call);
    setGreetingScore(20);
    setObjectionScore(20);
    setScriptScore(20);
    setClosingScore(20);
    setFeedback('');
    setIsFatal(false);
    setIsModalOpen(true);
  };

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCall) return;

    const totalScore = greetingScore + objectionScore + scriptScore + closingScore;

    try {
      await submitAudit({
        call_id: selectedCall.id,
        score: totalScore,
        greeting_score: greetingScore,
        objection_handling_score: objectionScore,
        script_adherence_score: scriptScore,
        closing_score: closingScore,
        feedback,
        fatal_error_flag: isFatal
      }).unwrap();

      triggerToast('Evaluation submitted successfully! ✓');
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      console.error(err);
      triggerToast('Failed to submit evaluation. Using local update fallback.');
      
      // Local fallback
      setCalls(prev => prev.map(c => 
        c.id === selectedCall.id 
          ? { ...c, isAudited: true, score: totalScore, isFatal: isFatal }
          : c
      ));
      setIsModalOpen(false);
    }
  };

  return (
    <main className="ml-[200px] mt-16 p-margin-desktop min-h-screen relative text-xs">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
          {toastMessage}
        </div>
      )}

      <div className="flex flex-col gap-stack-md max-w-[1600px] mx-auto">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="font-display text-display text-on-surface">Audit Queue</h1>
            <p className="font-body-md text-on-surface-variant">Manage and perform quality audits for this week's call recordings.</p>
          </div>
          <button 
            onClick={() => triggerToast('Manual call attachment form coming soon')}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold hover:shadow-lg transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-lg" data-icon="add">add</span>
            <span className="text-label-md">Add Call Manually</span>
          </button>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-outline-variant flex flex-wrap gap-4 items-center">
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="font-label-caps text-label-caps text-on-surface-variant">PROCESS</label>
            <select className="bg-surface-container-low border border-outline-variant rounded p-1.5 text-body-sm focus:ring-2 focus:ring-primary outline-none">
              <option>All Processes</option>
              <option>DW (Domestic West)</option>
              <option>TR (Transport)</option>
              <option>MM (Mid Market)</option>
              <option>SC (Supply Chain)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="font-label-caps text-label-caps text-on-surface-variant">CALLER</label>
            <select className="bg-surface-container-low border border-outline-variant rounded p-1.5 text-body-sm focus:ring-2 focus:ring-primary outline-none">
              <option>All Analysts</option>
              <option>Ankit Sharma</option>
              <option>Rohan Mehra</option>
              <option>Sneha Kapur</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="font-label-caps text-label-caps text-on-surface-variant">DATE RANGE</label>
            <input className="bg-surface-container-low border border-outline-variant rounded p-1.5 text-body-sm w-full focus:ring-2 focus:ring-primary outline-none" type="date" />
          </div>
          <div className="flex flex-col gap-1 min-w-[140px]">
            <label className="font-label-caps text-label-caps text-on-surface-variant">STATUS</label>
            <div className="flex gap-2 p-1 bg-surface-container-low border border-outline-variant rounded">
              <button className="bg-primary text-on-primary px-3 py-1 rounded text-label-caps">ALL</button>
              <button className="px-3 py-1 text-on-surface-variant hover:bg-surface-variant rounded text-label-caps">PENDING</button>
              <button className="px-3 py-1 text-on-surface-variant hover:bg-surface-variant rounded text-label-caps">IN PROGRESS</button>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
              <span className="material-symbols-outlined" data-icon="search">search</span>
            </button>
            <button onClick={() => refetch()} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
              <span className="material-symbols-outlined" data-icon="refresh">refresh</span>
            </button>
          </div>
        </div>

        <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden">
          <div className="overflow-x-auto h-[500px] scrollbar-hide">
            <table className="w-full text-left border-collapse audit-table">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="p-3 font-label-caps text-label-caps text-on-surface-variant w-12">#</th>
                  <th className="p-3 font-label-caps text-label-caps text-on-surface-variant">CALLER</th>
                  <th className="p-3 font-label-caps text-label-caps text-on-surface-variant">PROCESS</th>
                  <th className="p-3 font-label-caps text-label-caps text-on-surface-variant">LEAD TMID</th>
                  <th className="p-3 font-label-caps text-label-caps text-on-surface-variant">CALL DATE</th>
                  <th className="p-3 font-label-caps text-label-caps text-on-surface-variant">DURATION</th>
                  <th className="p-3 font-label-caps text-label-caps text-on-surface-variant text-center">PLAY REC</th>
                  <th className="p-3 font-label-caps text-label-caps text-on-surface-variant">STATUS</th>
                  <th className="p-3 font-label-caps text-label-caps text-on-surface-variant text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-medium text-gray-700">
                {calls.map((call, index) => (
                  <tr key={call.id} className="hover:bg-surface-container-low/30 transition-colors">
                    <td className="p-3 text-on-surface-variant font-mono">{index + 1}</td>
                    <td className="p-3 font-bold text-gray-900">{call.callerName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded font-semibold uppercase text-[10px]">
                        {call.process}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-gray-855">{call.tmid}</td>
                    <td className="p-3 text-on-surface-variant">{call.timestamp}</td>
                    <td className="p-3 font-mono">{call.duration}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handlePlayAudio(call.id, call.recordingUrl)}
                        className={`p-1.5 rounded-full inline-flex items-center justify-center transition-all ${
                          playingAudioId === call.id ? 'bg-primary text-on-primary' : 'bg-surface-variant hover:bg-primary/20 text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">
                          {playingAudioId === call.id ? 'pause' : 'play_arrow'}
                        </span>
                      </button>
                    </td>
                    <td className="p-3">
                      {call.isAudited ? (
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${call.isFatal ? 'bg-error' : 'bg-emerald-500'}`}></span>
                          <span className="font-bold">
                            {call.score}% {call.isFatal && '(Fatal)'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-450 italic">Pending</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {call.isAudited ? (
                        <button 
                          disabled
                          className="bg-gray-100 text-gray-400 px-3 py-1 rounded font-bold text-[10px] cursor-not-allowed"
                        >
                          Audited
                        </button>
                      ) : (
                        <button
                          onClick={() => openAuditModal(call)}
                          className="bg-primary text-on-primary hover:shadow-sm hover:brightness-110 px-3 py-1 rounded font-bold text-[10px] transition-all"
                        >
                          Audit Now
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-surface-container-low border-t border-outline-variant flex justify-between items-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">Showing {calls.length} of {calls.length} recordings</p>
            <div className="flex items-center gap-2">
              <button className="p-1 rounded hover:bg-surface-variant/50 text-on-surface-variant border border-outline-variant">
                <span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
              </button>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded bg-primary text-on-primary font-bold text-body-sm">1</button>
              </div>
              <button className="p-1 rounded hover:bg-surface-variant/50 text-on-surface-variant border border-outline-variant">
                <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mt-2">
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl" data-icon="pending_actions">pending_actions</span>
            </div>
            <div>
              <p className="text-label-caps font-label-caps text-on-surface-variant">TOTAL PENDING</p>
              <p className="text-headline-md font-headline-md">{calls.filter(c => !c.isAudited).length}</p>
            </div>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl" data-icon="sync">sync</span>
            </div>
            <div>
              <p className="text-label-caps font-label-caps text-on-surface-variant">IN PROGRESS</p>
              <p className="text-headline-md font-headline-md">12</p>
            </div>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl" data-icon="task_alt">task_alt</span>
            </div>
            <div>
              <p className="text-label-caps font-label-caps text-on-surface-variant">COMPLETED</p>
              <p className="text-headline-md font-headline-md">{calls.filter(c => c.isAudited).length}</p>
            </div>
          </div>
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-error/10 text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl" data-icon="warning">warning</span>
            </div>
            <div>
              <p className="text-label-caps font-label-caps text-on-surface-variant">FATAL ERRORS</p>
              <p className="text-headline-md font-headline-md">{calls.filter(c => c.isFatal).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* EVALUATION MODAL */}
      {isModalOpen && selectedCall && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form 
            onSubmit={handleAuditSubmit}
            className="bg-white rounded-xl border border-outline-variant w-full max-w-lg overflow-hidden shadow-2xl flex flex-col justify-between"
          >
            <div className="p-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Call Quality Evaluation scorecard</h3>
                <p className="text-[10px] text-gray-400">Auditing call for {selectedCall.callerName} · Lead: {selectedCall.tmid}</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Scoring grid */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Evaluation Parameters (Max 25 pts each)</span>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-700">1. Opening & Greeting (0 - 25)</label>
                    <input 
                      type="number" 
                      min="0" max="25" 
                      value={greetingScore}
                      onChange={(e) => setGreetingScore(Number(e.target.value))}
                      className="border border-gray-350 rounded p-1 w-14 font-mono font-bold text-center"
                    />
                  </div>
                  <input 
                    type="range" min="0" max="25" 
                    value={greetingScore}
                    onChange={(e) => setGreetingScore(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-700">2. Objection Handling (0 - 25)</label>
                    <input 
                      type="number" 
                      min="0" max="25" 
                      value={objectionScore}
                      onChange={(e) => setObjectionScore(Number(e.target.value))}
                      className="border border-gray-350 rounded p-1 w-14 font-mono font-bold text-center"
                    />
                  </div>
                  <input 
                    type="range" min="0" max="25" 
                    value={objectionScore}
                    onChange={(e) => setObjectionScore(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-700">3. Script Adherence (0 - 25)</label>
                    <input 
                      type="number" 
                      min="0" max="25" 
                      value={scriptScore}
                      onChange={(e) => setScriptScore(Number(e.target.value))}
                      className="border border-gray-350 rounded p-1 w-14 font-mono font-bold text-center"
                    />
                  </div>
                  <input 
                    type="range" min="0" max="25" 
                    value={scriptScore}
                    onChange={(e) => setScriptScore(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-gray-700">4. Call Closing (0 - 25)</label>
                    <input 
                      type="number" 
                      min="0" max="25" 
                      value={closingScore}
                      onChange={(e) => setClosingScore(Number(e.target.value))}
                      className="border border-gray-350 rounded p-1 w-14 font-mono font-bold text-center"
                    />
                  </div>
                  <input 
                    type="range" min="0" max="25" 
                    value={closingScore}
                    onChange={(e) => setClosingScore(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              {/* Total Score display */}
              <div className="p-3 bg-primary/10 rounded-lg flex justify-between items-center font-bold">
                <span className="text-primary text-label-caps">CALCULATED SCORE</span>
                <span className="text-headline-sm font-mono text-primary">{greetingScore + objectionScore + scriptScore + closingScore}%</span>
              </div>

              {/* Feedback */}
              <div className="space-y-1">
                <label className="font-semibold text-gray-700 block">Feedback & Comments</label>
                <textarea 
                  required
                  rows={3}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Describe agent performance, compliance failures, or exceptional remarks..."
                  className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              {/* Fatal Error Check */}
              <div className="bg-error/15 border border-error/25 p-3 rounded-lg flex items-center justify-between font-bold">
                <div>
                  <span className="text-error block text-[10.5px]">MARK AS FATAL ERROR</span>
                  <span className="text-[9.5px] text-error/80 font-normal">Auto-fails the call (forces score status to red alert)</span>
                </div>
                <input 
                  type="checkbox"
                  checked={isFatal}
                  onChange={(e) => setIsFatal(e.target.checked)}
                  className="w-4 h-4 accent-error cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 border-t border-outline-variant bg-surface-container-low flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-primary text-on-primary py-2 rounded-xl font-bold text-center shadow-md active:scale-[0.98] transition-all"
              >
                Submit scorecard
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-white border border-gray-250 text-gray-500 py-2 rounded-xl font-bold text-center"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

export default AuditQueue;
