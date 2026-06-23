import React, { useState } from 'react';

interface DecliningAgent {
  name: string;
  campaign: string;
  score: string;
  trend: string;
}

interface FatalError {
  type: string;
  agent: string;
  leadId: string;
  timeAgo: string;
  recordingUrl: string;
}

interface Evaluation {
  id: string;
  agentName: string;
  dateTime: string;
  campaign: string;
  score: number;
  auditor: string;
  details: {
    greeting: string;
    needAnalysis: string;
    objectionHandling: string;
    compliance: string;
  };
}

export const QcConsoleRefined: React.FC = () => {
  // Mock Data States
  const [decliningAgents, setDecliningAgents] = useState<DecliningAgent[]>([
    { name: 'Rahul K.', campaign: 'Auto-Loan', score: '68.5%', trend: '-12%' },
    { name: 'Amit V.', campaign: 'Outbound', score: '61.0%', trend: '-15%' },
    { name: 'Meera S.', campaign: 'Insurance', score: '72.1%', trend: '-8%' }
  ]);

  const [fatalErrors] = useState<FatalError[]>([
    { type: 'MIS-SELLING', agent: 'Priya D.', leadId: '#99021', timeAgo: '2m ago', recordingUrl: 'rec_priya.mp3' },
    { type: 'COMPLIANCE', agent: 'Suresh K.', leadId: '#98442', timeAgo: '14m ago', recordingUrl: 'rec_suresh.mp3' }
  ]);

  // Page 1 and Page 2 mock data for pagination
  const evaluationsPage1: Evaluation[] = [
    { id: '#QC-8829', agentName: 'Ayesha Khan', dateTime: '24 May, 11:45 AM', campaign: 'Personal Loan', score: 88, auditor: 'Vikram S.', details: { greeting: '9/10', needAnalysis: '9/10', objectionHandling: '8/10', compliance: '9/10' } },
    { id: '#QC-8827', agentName: 'Rahul K.', dateTime: '24 May, 10:20 AM', campaign: 'Auto-Loan', score: 54, auditor: 'Anjali P.', details: { greeting: '6/10', needAnalysis: '5/10', objectionHandling: '5/10', compliance: '6/10' } },
    { id: '#QC-8825', agentName: 'Amit V.', dateTime: '24 May, 09:55 AM', campaign: 'Inbound-CC', score: 71, auditor: 'Vikram S.', details: { greeting: '7/10', needAnalysis: '7/10', objectionHandling: '7/10', compliance: '8/10' } }
  ];

  const evaluationsPage2: Evaluation[] = [
    { id: '#QC-8820', agentName: 'Suresh K.', dateTime: '23 May, 04:15 PM', campaign: 'Fulfillment', score: 92, auditor: 'Anjali P.', details: { greeting: '10/10', needAnalysis: '9/10', objectionHandling: '9/10', compliance: '9/10' } },
    { id: '#QC-8815', agentName: 'Priya D.', dateTime: '22 May, 02:30 PM', campaign: 'Inbound-CC', score: 62, auditor: 'Vikram S.', details: { greeting: '6/10', needAnalysis: '6/10', objectionHandling: '7/10', compliance: '6/10' } }
  ];

  // Interactive UI States
  const [toast, setToast] = useState<string | null>(null);
  const [filterPeriod, setFilterPeriod] = useState('Last 7 Days');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [calibrationModal, setCalibrationModal] = useState<boolean>(false);
  const [calibrationAgent, setCalibrationAgent] = useState<string>('');
  const [calibrationDate, setCalibrationDate] = useState('');
  const [calibrationTopic, setCalibrationTopic] = useState('Auto-Loan');

  const [playingRecording, setPlayingRecording] = useState<FatalError | null>(null);
  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null);
  const [showAllFatals, setShowAllFatals] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const audioDuration = '4:32';

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleBookCalibrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calibrationAgent) {
      alert('Please specify an agent');
      return;
    }
    showToast(`Calibration Session booked for ${calibrationAgent} on ${calibrationDate || 'Tomorrow'} regarding ${calibrationTopic}`);
    setCalibrationModal(false);
    setCalibrationAgent('');
  };

  const currentEvaluations = currentPage === 1 ? evaluationsPage1 : evaluationsPage2;

  return (
    <main className="p-6 pt-2 md:pt-4 space-y-6 bg-white relative">

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 bg-slate-900 text-white text-xs md:text-sm px-5 py-2.5 rounded-xl z-50 transition-all font-bold border border-slate-800">
          {toast}
        </div>
      )}

      {/* Backdrop for dropdowns */}
      {showPeriodDropdown && (
        <div className="fixed inset-0 z-20 cursor-default" onClick={() => setShowPeriodDropdown(false)} />
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-slate-200 rounded-xl">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">QC Console</h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1">Operational quality oversight &amp; fatal error tracking</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end relative">
          <button
            onClick={() => { setCalibrationAgent(''); setCalibrationModal(true); }}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-sm md:text-base">calendar_month</span>
            <span>Book Calibration</span>
          </button>

          <div
            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
            className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-700 text-xs md:text-sm font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-50 transition-all"
          >
            <span className="material-symbols-outlined text-sm md:text-base">filter_alt</span>
            <span>{filterPeriod}</span>
            <span className="material-symbols-outlined text-xs md:text-sm">keyboard_arrow_down</span>
          </div>

          {showPeriodDropdown && (
            <div className="absolute top-full right-0 mt-1.5 bg-white border border-slate-200 rounded-xl z-30 py-1.5 w-40 text-xs font-bold text-slate-700">
              {['Last 7 Days', 'Last 30 Days', 'Today', 'This Month'].map(period => (
                <div
                  key={period}
                  onClick={() => { setFilterPeriod(period); setShowPeriodDropdown(false); showToast(`QC metrics loaded for: ${period}`); }}
                  className={`px-4 py-2 hover:bg-slate-55 cursor-pointer ${filterPeriod === period ? 'text-amber-600 bg-amber-50/40' : ''}`}
                >
                  {period}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 border border-slate-200 rounded-xl flex flex-col justify-between min-h-[100px]">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall QC Score</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-black text-amber-500">82.4%</span>
            <span className="text-xs text-green-600 font-bold mb-1 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +2.1%
            </span>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-xl flex flex-col justify-between min-h-[100px]">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fatal Error Rate</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-black text-red-600">1.2%</span>
            <span className="text-xs text-red-650 font-bold mb-1 flex items-center gap-0.5 animate-pulse">
              <span className="material-symbols-outlined text-[14px]">priority_high</span> High
            </span>
          </div>
        </div>

        <div className="bg-white p-5 border border-slate-200 rounded-xl flex flex-col justify-between min-h-[100px]">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Audits Completed</p>
          <div className="flex items-end gap-2 mt-2">
            <span className="text-2xl md:text-3xl font-black text-slate-800">1,240</span>
            <span className="text-xs text-slate-400 font-bold mb-1 uppercase">MTD</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Performance Declines Card */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="text-xs md:text-sm font-bold text-slate-650 uppercase tracking-wider">Performance Declines (3-Week Trend)</h3>
            <span className="text-[10px] md:text-xs font-black text-white bg-red-600 px-2.5 py-0.5 rounded-full">ALERT</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-slate-200 bg-white text-xs">
                  <th className="px-5 py-3 font-bold text-left">Caller Name</th>
                  <th className="px-5 py-3 font-bold text-center">Score</th>
                  <th className="px-5 py-3 font-bold text-center">Trend</th>
                  <th className="px-5 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                {decliningAgents.map((a, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-extrabold text-slate-800">{a.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Campaign: {a.campaign}</p>
                    </td>
                    <td className="px-5 py-3.5 text-center font-extrabold">{a.score}</td>
                    <td className="px-5 py-3.5 text-center text-red-600 font-black">{a.trend}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => { setCalibrationAgent(a.name); setCalibrationTopic(a.campaign); setCalibrationModal(true); }}
                        className="text-xs font-bold text-amber-500 hover:text-amber-600 border border-slate-200 hover:border-amber-500 px-3.5 py-1.5 rounded-lg transition-all active:scale-95"
                      >
                        Book Calibration
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fatal Error Feed Card */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 bg-red-50 flex justify-between items-center">
            <h3 className="text-xs md:text-sm font-bold text-red-900 uppercase flex items-center gap-1.5 tracking-wider">
              <span className="material-symbols-outlined text-[18px] text-red-600">report</span>
              Fatal Error Feed
            </h3>
            <span className="text-[10px] font-black text-red-700 bg-red-100 border border-red-200 px-2.5 py-0.5 rounded-full animate-pulse">LIVE</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[350px] divide-y divide-slate-100">
            {fatalErrors.map((f, i) => (
              <div key={i} className="p-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div>
                    <p className="text-xs font-black text-red-600 mb-1">{f.type}</p>
                    <p className="font-extrabold text-slate-800">{f.agent}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Lead ID: {f.leadId}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold">{f.timeAgo}</span>
                </div>
                <button
                  onClick={() => setPlayingRecording(f)}
                  className="w-full py-2 border border-slate-200 text-xs font-bold text-amber-500 hover:text-amber-600 hover:border-amber-500 rounded-lg bg-white transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm md:text-base">play_circle</span>
                  <span>Listen Recording</span>
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowAllFatals(true)}
            className="w-full py-3.5 text-xs md:text-sm font-black text-amber-500 hover:bg-slate-50 border-t border-slate-200 transition-colors"
          >
            View All Fatals
          </button>
        </div>
      </div>

      {/* Recent Evaluations Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-xs md:text-sm font-bold text-slate-800 uppercase tracking-wider">Recent QC Evaluations</h3>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 font-bold">
              Showing <span className="font-extrabold text-slate-800">
                {currentPage === 1 ? '1-3' : '4-5'}
              </span> of 5
            </span>
            <div className="flex border border-slate-200 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => { if (currentPage > 1) { setCurrentPage(1); showToast('Loaded page 1'); } }}
                className={`px-3 py-1.5 hover:bg-slate-50 border-r border-slate-200 transition-colors flex items-center justify-center ${currentPage === 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
                disabled={currentPage === 1}
              >
                <span className="material-symbols-outlined text-sm md:text-base">chevron_left</span>
              </button>
              <button
                onClick={() => { if (currentPage === 1) { setCurrentPage(2); showToast('Loaded page 2'); } }}
                className={`px-3 py-1.5 hover:bg-slate-50 transition-colors flex items-center justify-center ${currentPage === 2 ? 'opacity-40 cursor-not-allowed' : ''}`}
                disabled={currentPage === 2}
              >
                <span className="material-symbols-outlined text-sm md:text-base">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-55 text-slate-400 border-b border-slate-200 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-3 text-left">Eval ID</th>
                <th className="px-6 py-3 text-left">Agent Name</th>
                <th className="px-6 py-3 text-left">Date &amp; Time</th>
                <th className="px-6 py-3 text-left">Campaign</th>
                <th className="px-6 py-3 text-center">Score</th>
                <th className="px-6 py-3 text-left">Auditor</th>
                <th className="px-6 py-3 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
              {currentEvaluations.map(ev => (
                <tr key={ev.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-amber-500 font-bold">{ev.id}</td>
                  <td className="px-6 py-4 font-extrabold text-slate-800">{ev.agentName}</td>
                  <td className="px-6 py-4 text-slate-400">{ev.dateTime}</td>
                  <td className="px-6 py-4 text-slate-500">{ev.campaign}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${ev.score >= 80 ? 'bg-green-500' :
                          ev.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></span>
                      <span className={`font-black ${ev.score >= 80 ? 'text-green-600' :
                          ev.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                        }`}>{ev.score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{ev.auditor}</td>
                  <td className="px-6 py-4 text-right pr-6">
                    <button
                      onClick={() => setSelectedEval(ev)}
                      className="material-symbols-outlined text-slate-400 hover:text-amber-500 active:scale-90 transition-all"
                    >
                      visibility
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200">
          <button
            onClick={() => setShowAllHistory(true)}
            className="text-xs font-black text-amber-500 flex items-center gap-2 hover:gap-3 transition-all uppercase"
          >
            View Complete Audit History
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Book Calibration Modal */}
      {calibrationModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl border border-slate-200 w-[450px] max-w-full text-xs md:text-sm">
            <h3 className="text-sm md:text-base font-bold uppercase mb-4 text-slate-800 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-500">calendar_today</span>
              Book Calibration Session
            </h3>
            <form onSubmit={handleBookCalibrationSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">Target Agent</label>
                <input
                  type="text"
                  value={calibrationAgent}
                  onChange={(e) => setCalibrationAgent(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 font-bold text-slate-850 outline-none"
                  placeholder="e.g. Rahul K."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Campaign Topic</label>
                  <input
                    type="text"
                    value={calibrationTopic}
                    onChange={(e) => setCalibrationTopic(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 font-bold text-slate-850 outline-none"
                    placeholder="e.g. Auto-Loan"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Date &amp; Time</label>
                  <input
                    type="text"
                    value={calibrationDate}
                    onChange={(e) => setCalibrationDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 font-bold text-slate-850 outline-none"
                    placeholder="e.g. 25 May, 3:00 PM"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCalibrationModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold"
                >
                  Book Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Audio Playback Modal */}
      {playingRecording && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl border border-slate-200 w-[450px] max-w-full text-xs md:text-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black text-red-650 bg-red-55 border border-red-200 px-2.5 py-0.5 rounded-full">{playingRecording.type}</span>
                <h3 className="text-sm md:text-base font-bold uppercase text-slate-800 mt-2">{playingRecording.agent}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Lead ID: {playingRecording.leadId}</p>
              </div>
              <button onClick={() => setPlayingRecording(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Audio Waveform mock */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 my-4 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-500 font-bold mb-3">Playing call recording...</span>
              <div className="flex items-center gap-1.5 h-12 w-full justify-center">
                {[...Array(20)].map((_, idx) => {
                  const h = 10 + Math.sin(idx * 0.5) * 25 + Math.random() * 8;
                  return (
                    <div
                      key={idx}
                      className="w-1.5 bg-amber-500/80 rounded-full animate-pulse"
                      style={{ height: `${h}px`, animationDelay: `${idx * 0.1}s` }}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between w-full text-xs text-slate-400 font-mono mt-3 px-1">
                <span>0:42</span>
                <span>{audioDuration}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPlayingRecording(null)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold"
              >
                Stop &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QC Evaluation Details Modal */}
      {selectedEval && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl border border-slate-200 w-[450px] max-w-full text-xs md:text-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black text-amber-600 font-mono border border-amber-250 bg-amber-50 px-2 py-0.5 rounded-full">{selectedEval.id}</span>
                <h3 className="text-sm md:text-base font-bold uppercase text-slate-800 mt-2">{selectedEval.agentName}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedEval.campaign} • Checked by {selectedEval.auditor}</p>
              </div>
              <button onClick={() => setSelectedEval(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="border-t border-b border-slate-200 py-3.5 my-4 space-y-2.5">
              <div className="flex justify-between font-bold text-slate-400">
                <span>Evaluation Metric</span>
                <span>Grade</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold">
                <span className="text-slate-500">Opening Greeting / Script Intro:</span>
                <span className="text-slate-700">{selectedEval.details.greeting}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">Need Analysis / Customer Profile:</span>
                <span className="text-slate-700">{selectedEval.details.needAnalysis}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">Objection Handling &amp; Benefits:</span>
                <span className="text-slate-700">{selectedEval.details.objectionHandling}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-slate-500">Compliance &amp; Terms Disclosure:</span>
                <span className="text-slate-700">{selectedEval.details.compliance}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-black text-sm">
                <span className="text-slate-800">Cumulative Evaluation Score:</span>
                <span className="text-amber-500">{selectedEval.score}%</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEval(null)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View All Fatals Modal */}
      {showAllFatals && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl border border-slate-200 w-[500px] max-w-full text-xs md:text-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm md:text-base font-bold uppercase text-red-600">All Logged Fatal Errors</h3>
              <button onClick={() => setShowAllFatals(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {[
                { type: 'MIS-SELLING', agent: 'Priya D.', leadId: '#99021', time: '2m ago' },
                { type: 'COMPLIANCE', agent: 'Suresh K.', leadId: '#98442', time: '14m ago' },
                { type: 'ABUSIVE LANGUAGE', agent: 'Rahul S.', leadId: '#97120', time: '1d ago' },
                { type: 'COMPLIANCE', agent: 'Sneha L.', leadId: '#96481', time: '3d ago' }
              ].map((f, i) => (
                <div key={i} className="py-3.5 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black text-red-650 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">{f.type}</span>
                    <p className="font-extrabold text-slate-800 mt-2">{f.agent} • {f.leadId}</p>
                  </div>
                  <span className="text-slate-450 font-bold">{f.time}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-150 mt-4">
              <button
                type="button"
                onClick={() => setShowAllFatals(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold"
              >
                Close List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Complete History Modal */}
      {showAllHistory && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl border border-slate-200 w-[600px] max-w-full text-xs md:text-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm md:text-base font-bold uppercase text-slate-800">Complete Audit History</h3>
              <button onClick={() => setShowAllHistory(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {[
                { id: '#QC-8829', agent: 'Ayesha Khan', date: '24 May', campaign: 'Personal Loan', score: '88%', auditor: 'Vikram S.' },
                { id: '#QC-8827', agent: 'Rahul K.', date: '24 May', campaign: 'Auto-Loan', score: '54%', auditor: 'Anjali P.' },
                { id: '#QC-8825', agent: 'Amit V.', date: '24 May', campaign: 'Inbound-CC', score: '71%', auditor: 'Vikram S.' },
                { id: '#QC-8820', agent: 'Suresh K.', date: '23 May', campaign: 'Fulfillment', score: '92%', auditor: 'Anjali P.' },
                { id: '#QC-8815', agent: 'Priya D.', date: '22 May', campaign: 'Inbound-CC', score: '62%', auditor: 'Vikram S.' }
              ].map((ev, i) => (
                <div key={i} className="py-3.5 flex justify-between items-center">
                  <div>
                    <span className="font-mono text-amber-500 font-black">{ev.id}</span>
                    <p className="font-extrabold text-slate-800 mt-1">{ev.agent} ({ev.campaign})</p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-700">{ev.score}</span>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Audited by {ev.auditor} on {ev.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4 border-t border-slate-150 mt-4">
              <button
                type="button"
                onClick={() => setShowAllHistory(false)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default QcConsoleRefined;
