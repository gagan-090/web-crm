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

export const Page06QcConsole: React.FC = () => {
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

  const [evaluations] = useState<Evaluation[]>([
    { id: '#QC-8829', agentName: 'Ayesha Khan', dateTime: '24 May, 11:45 AM', campaign: 'Personal Loan', score: 88, auditor: 'Vikram S.', details: { greeting: '9/10', needAnalysis: '9/10', objectionHandling: '8/10', compliance: '9/10' } },
    { id: '#QC-8827', agentName: 'Rahul K.', dateTime: '24 May, 10:20 AM', campaign: 'Auto-Loan', score: 54, auditor: 'Anjali P.', details: { greeting: '6/10', needAnalysis: '5/10', objectionHandling: '5/10', compliance: '6/10' } },
    { id: '#QC-8825', agentName: 'Amit V.', dateTime: '24 May, 09:55 AM', campaign: 'Inbound-CC', score: 71, auditor: 'Vikram S.', details: { greeting: '7/10', needAnalysis: '7/10', objectionHandling: '7/10', compliance: '8/10' } }
  ]);

  // Interactive UI States
  const [toast, setToast] = useState<string | null>(null);
  const [filterPeriod, setFilterPeriod] = useState('Last 7 Days');
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  
  // Modals
  const [calibrationModal, setCalibrationModal] = useState<boolean>(false);
  const [calibrationAgent, setCalibrationAgent] = useState<string>('');
  const [calibrationDate, setCalibrationDate] = useState('');
  const [calibrationTopic, setCalibrationTopic] = useState('Auto-Loan');

  const [playingRecording, setPlayingRecording] = useState<FatalError | null>(null);
  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null);
  const [showAllFatals, setShowAllFatals] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

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

  return (
    <main className="pt-[56px] p-6 space-y-6 bg-white relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 bg-slate-900 text-white text-xs px-4 py-2.5 rounded shadow-xl z-50 transition-all font-bold">
          {toast}
        </div>
      )}

      {/* Backdrop for dropdowns */}
      {showPeriodDropdown && (
        <div className="fixed inset-0 z-20 cursor-default" onClick={() => setShowPeriodDropdown(false)} />
      )}

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">QC Console</h2>
          <p className="text-sm text-gray-500">Operational quality oversight &amp; fatal error tracking</p>
        </div>
        <div className="flex gap-2 relative">
          <button 
            onClick={() => { setCalibrationAgent(''); setCalibrationModal(true); }}
            className="flipkart-blue text-white px-4 py-2 btn-radius text-sm font-bold flex items-center gap-2 hover:opacity-90 shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">calendar_month</span>
            Book Calibration
          </button>
          
          <div 
            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
            className="bg-white border border-e0 px-3 py-2 btn-radius text-gray-600 text-sm flex items-center gap-2 cursor-pointer hover:bg-gray-50"
          >
            <span className="material-symbols-outlined text-lg">filter_alt</span>
            {filterPeriod}
            <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>
          </div>

          {showPeriodDropdown && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-outline-variant rounded shadow-md z-30 py-1 w-36 text-xs font-semibold text-slate-700">
              {['Last 7 Days', 'Last 30 Days', 'Today', 'This Month'].map(period => (
                <div 
                  key={period}
                  onClick={() => { setFilterPeriod(period); setShowPeriodDropdown(false); showToast(`QC metrics loaded for: ${period}`); }}
                  className={`px-3 py-1.5 hover:bg-slate-50 cursor-pointer ${filterPeriod === period ? 'text-primary font-bold bg-primary/5' : ''}`}
                >
                  {period}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-4 card-shadow border border-e0 btn-radius">
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Overall QC Score</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold flipkart-text-blue">82.4%</span>
            <span className="text-xs text-green-600 font-bold mb-1 flex items-center">
              <span className="material-symbols-outlined text-sm">trending_up</span> +2.1%
            </span>
          </div>
        </div>
        <div className="bg-white p-4 card-shadow border border-e0 btn-radius">
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Fatal Error Rate</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold flipkart-text-red">1.2%</span>
            <span className="text-xs flipkart-text-red font-bold mb-1 flex items-center">
              <span className="material-symbols-outlined text-sm">priority_high</span> High
            </span>
          </div>
        </div>
        <div className="bg-white p-4 card-shadow border border-e0 btn-radius">
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Audits Completed</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">1,240</span>
            <span className="text-xs text-gray-400 font-medium mb-1">MTD</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Performance Declines Card */}
        <div className="col-span-7 bg-white card-shadow border border-e0 btn-radius overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-e0 bg-gray-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-900 uppercase">Performance Declines (3-Week Trend)</h3>
            <span className="text-[10px] font-bold flipkart-red text-white px-2 py-0.5 btn-radius">ALERT</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-e0 bg-white">
                <th className="px-4 py-2 font-semibold text-left">Caller Name</th>
                <th className="px-4 py-2 font-semibold text-center">Score</th>
                <th className="px-4 py-2 font-semibold text-center">Trend</th>
                <th className="px-4 py-2 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-e0">
              {decliningAgents.map((a, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-bold">{a.name}</p>
                    <p className="text-xs text-gray-500">Campaign: {a.campaign}</p>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">{a.score}</td>
                  <td className="px-4 py-3 text-center flipkart-text-red font-bold">{a.trend}</td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => { setCalibrationAgent(a.name); setCalibrationTopic(a.campaign); setCalibrationModal(true); }}
                      className="text-[11px] font-bold flipkart-text-blue border border-[#2874F0] px-3 py-1 btn-radius hover:bg-blue-50 active:scale-95 transition-all"
                    >
                      Book Calibration
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fatal Error Feed Card */}
        <div className="col-span-5 bg-white card-shadow border border-e0 btn-radius flex flex-col">
          <div className="px-4 py-3 border-b border-e0 bg-red-50 flex justify-between items-center">
            <h3 className="text-sm font-bold flipkart-text-red uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>report</span>
              Fatal Error Feed
            </h3>
            <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[280px] divide-y divide-e0">
            {fatalErrors.map((f, i) => (
              <div key={i} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs font-bold flipkart-text-red mb-1">{f.type}</p>
                    <p className="text-sm font-bold text-slate-800">{f.agent}</p>
                    <p className="text-xs text-gray-500">Lead ID: {f.leadId}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{f.timeAgo}</span>
                </div>
                <button 
                  onClick={() => setPlayingRecording(f)}
                  className="w-full py-1.5 border border-e0 text-[11px] font-bold flipkart-text-blue btn-radius hover:bg-blue-50 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <span className="material-symbols-outlined text-sm">play_circle</span> Listen Recording
                </button>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setShowAllFatals(true)}
            className="w-full py-3 text-xs font-bold flipkart-text-blue border-t border-e0 hover:bg-gray-50"
          >
            View All Fatals
          </button>
        </div>
      </div>

      {/* Recent Evaluations Table */}
      <div className="bg-white card-shadow border border-e0 btn-radius overflow-hidden">
        <div className="px-6 py-4 border-b border-e0 flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Recent QC Evaluations</h3>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">Showing <span className="font-bold text-gray-900">1-{evaluations.length}</span> of 142</span>
            <div className="flex border border-e0 btn-radius">
              <button 
                onClick={() => showToast('Pagination clicked (Page 1)')}
                className="px-2 py-1 hover:bg-gray-50 border-r border-e0"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <button 
                onClick={() => showToast('Pagination clicked (Page 2)')}
                className="px-2 py-1 hover:bg-gray-50"
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b border-e0 text-[11px] uppercase tracking-wider font-bold">
                <th className="px-6 py-3 text-left">Eval ID</th>
                <th className="px-6 py-3 text-left">Agent Name</th>
                <th className="px-6 py-3 text-left">Date &amp; Time</th>
                <th className="px-6 py-3 text-left">Campaign</th>
                <th className="px-6 py-3 text-center">Score</th>
                <th className="px-6 py-3 text-left">Auditor</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-e0">
              {evaluations.map(ev => (
                <tr key={ev.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs flipkart-text-blue">{ev.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{ev.agentName}</td>
                  <td className="px-6 py-4 text-gray-500">{ev.dateTime}</td>
                  <td className="px-6 py-4 text-gray-500">{ev.campaign}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        ev.score >= 80 ? 'bg-green-500' :
                        ev.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></span>
                      <span className={`font-bold ${
                        ev.score >= 80 ? 'text-green-600' :
                        ev.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>{ev.score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{ev.auditor}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedEval(ev)}
                      className="material-symbols-outlined text-gray-400 hover:text-primary active:scale-95 transition-all" 
                      data-icon="visibility"
                    >
                      visibility
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-e0">
          <button 
            onClick={() => setShowAllHistory(true)}
            className="text-xs font-bold flipkart-text-blue flex items-center gap-2 hover:gap-3 transition-all uppercase"
          >
            View Complete Audit History
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Book Calibration Modal */}
      {calibrationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-md shadow-2xl w-[450px] border border-outline-variant max-w-full">
            <h3 className="text-sm font-extrabold uppercase mb-4 text-primary">Book Calibration Session</h3>
            <form onSubmit={handleBookCalibrationSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-outline uppercase mb-1">Target Agent</label>
                <input 
                  type="text" 
                  value={calibrationAgent}
                  onChange={(e) => setCalibrationAgent(e.target.value)}
                  className="w-full border border-outline-variant rounded p-2 text-xs focus:outline-none focus:border-primary"
                  placeholder="e.g. Rahul K."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-outline uppercase mb-1">Campaign Topic</label>
                  <input 
                    type="text" 
                    value={calibrationTopic}
                    onChange={(e) => setCalibrationTopic(e.target.value)}
                    className="w-full border border-outline-variant rounded p-2 text-xs focus:outline-none focus:border-primary"
                    placeholder="e.g. Auto-Loan"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-outline uppercase mb-1">Date &amp; Time</label>
                  <input 
                    type="text" 
                    value={calibrationDate}
                    onChange={(e) => setCalibrationDate(e.target.value)}
                    className="w-full border border-outline-variant rounded p-2 text-xs focus:outline-none focus:border-primary"
                    placeholder="e.g. 25 May, 3:00 PM"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant">
                <button 
                  type="button" 
                  onClick={() => setCalibrationModal(false)}
                  className="px-4 py-2 border border-outline-variant rounded text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary text-white rounded text-xs font-bold hover:bg-primary-container shadow"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-md shadow-2xl w-[450px] border border-outline-variant max-w-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{playingRecording.type}</span>
                <h3 className="text-sm font-extrabold uppercase text-slate-800 mt-1.5">{playingRecording.agent}</h3>
                <p className="text-[11px] text-slate-400">Lead ID: {playingRecording.leadId}</p>
              </div>
              <button onClick={() => setPlayingRecording(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            {/* Audio Waveform mock */}
            <div className="bg-slate-50 p-4 rounded border border-outline-variant my-4 flex flex-col items-center justify-center">
              <span className="text-[11px] text-slate-500 font-medium mb-3">Playing call recording...</span>
              <div className="flex items-center gap-1.5 h-12 w-full justify-center">
                {[...Array(20)].map((_, idx) => {
                  const h = 10 + Math.sin(idx * 0.5) * 25 + Math.random() * 8;
                  return (
                    <div 
                      key={idx} 
                      className="w-1.5 bg-primary/80 rounded-full animate-pulse" 
                      style={{ height: `${h}px`, animationDelay: `${idx * 0.1}s` }}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between w-full text-[10px] text-slate-400 font-data-mono mt-3 px-1">
                <span>0:42</span>
                <span>3:15</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setPlayingRecording(null)}
                className="px-4 py-2 bg-primary text-white rounded text-xs font-bold hover:bg-primary-container shadow"
              >
                Stop &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QC Evaluation Details Modal */}
      {selectedEval && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-md shadow-2xl w-[450px] border border-outline-variant max-w-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold text-primary font-data-mono">{selectedEval.id}</span>
                <h3 className="text-sm font-extrabold uppercase text-slate-800">{selectedEval.agentName}</h3>
                <p className="text-[11px] text-slate-400">{selectedEval.campaign} • Checked by {selectedEval.auditor}</p>
              </div>
              <button onClick={() => setSelectedEval(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="border-t border-b border-outline-variant py-3 my-4 space-y-2 text-xs">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Evaluation Metric</span>
                <span className="text-slate-700">Auditor Grade</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2">
                <span className="text-slate-500">Opening Greeting / Script Intro:</span>
                <span className="font-bold text-slate-700">{selectedEval.details.greeting}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Need Analysis / Customer Profile:</span>
                <span className="font-bold text-slate-700">{selectedEval.details.needAnalysis}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Objection Handling &amp; Benefits:</span>
                <span className="font-bold text-slate-700">{selectedEval.details.objectionHandling}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Compliance &amp; Terms Disclosure:</span>
                <span className="font-bold text-slate-700">{selectedEval.details.compliance}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-sm">
                <span className="text-slate-800">Cumulative Evaluation Score:</span>
                <span className="text-primary">{selectedEval.score}%</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="button" 
                onClick={() => setSelectedEval(null)}
                className="px-4 py-2 bg-primary text-white rounded text-xs font-bold hover:bg-primary-container"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View All Fatals Modal */}
      {showAllFatals && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-md shadow-2xl w-[500px] border border-outline-variant max-w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-extrabold uppercase text-red-600">All Logged Fatal Errors</h3>
              <button onClick={() => setShowAllFatals(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="divide-y divide-outline-variant max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {[
                { type: 'MIS-SELLING', agent: 'Priya D.', leadId: '#99021', time: '2m ago' },
                { type: 'COMPLIANCE', agent: 'Suresh K.', leadId: '#98442', time: '14m ago' },
                { type: 'ABUSIVE LANGUAGE', agent: 'Rahul S.', leadId: '#97120', time: '1d ago' },
                { type: 'COMPLIANCE', agent: 'Sneha L.', leadId: '#96481', time: '3d ago' }
              ].map((f, i) => (
                <div key={i} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{f.type}</span>
                    <p className="font-bold text-slate-800 mt-1">{f.agent} • {f.leadId}</p>
                  </div>
                  <span className="text-slate-400">{f.time}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4 border-t border-outline-variant mt-4">
              <button 
                type="button" 
                onClick={() => setShowAllFatals(false)}
                className="px-4 py-2 bg-primary text-white rounded text-xs font-bold hover:bg-primary-container"
              >
                Close List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Complete History Modal */}
      {showAllHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-md shadow-2xl w-[600px] border border-outline-variant max-w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-extrabold uppercase text-slate-800">Complete Audit History</h3>
              <button onClick={() => setShowAllHistory(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="divide-y divide-outline-variant max-h-[350px] overflow-y-auto pr-2 custom-scrollbar text-xs">
              {[
                { id: '#QC-8829', agent: 'Ayesha Khan', date: '24 May', campaign: 'Personal Loan', score: '88%', auditor: 'Vikram S.' },
                { id: '#QC-8827', agent: 'Rahul K.', date: '24 May', campaign: 'Auto-Loan', score: '54%', auditor: 'Anjali P.' },
                { id: '#QC-8825', agent: 'Amit V.', date: '24 May', campaign: 'Inbound-CC', score: '71%', auditor: 'Vikram S.' },
                { id: '#QC-8820', agent: 'Suresh K.', date: '23 May', campaign: 'Fulfillment', score: '92%', auditor: 'Anjali P.' },
                { id: '#QC-8815', agent: 'Priya D.', date: '22 May', campaign: 'Inbound-CC', score: '62%', auditor: 'Vikram S.' }
              ].map((ev, i) => (
                <div key={i} className="py-3 flex justify-between items-center">
                  <div>
                    <span className="font-mono text-primary font-bold">{ev.id}</span>
                    <p className="font-bold text-slate-800 mt-0.5">{ev.agent} ({ev.campaign})</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-700">{ev.score}</span>
                    <p className="text-[10px] text-slate-400">Audited by {ev.auditor} on {ev.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4 border-t border-outline-variant mt-4">
              <button 
                type="button" 
                onClick={() => setShowAllHistory(false)}
                className="px-4 py-2 bg-primary text-white rounded text-xs font-bold hover:bg-primary-container"
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

export default Page06QcConsole;
