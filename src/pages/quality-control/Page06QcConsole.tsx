import React, { useState, useEffect } from 'react';

interface DeclineCaller {
  name: string;
  campaign: string;
  score: string;
  trend: string;
}

interface FatalFeedItem {
  id: string;
  type: string;
  agent: string;
  leadId: string;
  timeText: string;
  recordingUrl: string;
}

interface EvaluationItem {
  id: string;
  agent: string;
  dateTime: string;
  campaign: string;
  score: number;
  auditor: string;
  details: {
    greeting: number;
    verification: number;
    probing: number;
    pitching: number;
    closure: number;
  };
}

export const Page06QcConsole: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'7days' | '30days' | 'today'>('7days');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Modal states
  const [calibrationModalOpen, setCalibrationModalOpen] = useState(false);
  const [calibAgentName, setCalibAgentName] = useState('');
  const [calibCampaign, setCalibCampaign] = useState('Auto-Loan');
  const [calibTopic, setCalibTopic] = useState('Objection Handling');
  const [calibDate, setCalibDate] = useState('2023-10-27');

  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);
  const [selectedEval, setSelectedEval] = useState<EvaluationItem | null>(null);

  // Audio Player states
  const [activeAudio, setActiveAudio] = useState<FatalFeedItem | null>(null);
  const [audioIsPlaying, setAudioIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  // Pagination state
  const [evalPage, setEvalPage] = useState(1);

  // KPIs depending on selected time filter
  const kpis = {
    '7days': { score: '82.4%', scoreTrend: '+2.1%', fatal: '1.2%', completed: '1,240' },
    '30days': { score: '81.0%', scoreTrend: '+0.8%', fatal: '1.5%', completed: '4,850' },
    'today': { score: '85.6%', scoreTrend: '+4.3%', fatal: '0.8%', completed: '185' },
  };

  const currentKpis = kpis[timeFilter];

  const declines: DeclineCaller[] = [
    { name: 'Rahul K.', campaign: 'Auto-Loan', score: '68.5%', trend: '-12%' },
    { name: 'Amit V.', campaign: 'Outbound', score: '61.0%', trend: '-15%' },
    { name: 'Meera S.', campaign: 'Insurance', score: '72.1%', trend: '-8%' },
  ];

  const fatals: FatalFeedItem[] = [
    { id: 'f-1', type: 'MIS-SELLING', agent: 'Priya D.', leadId: '#99021', timeText: '2m ago', recordingUrl: 'Priya_D_MisSelling.mp3' },
    { id: 'f-2', type: 'COMPLIANCE', agent: 'Suresh K.', leadId: '#98442', timeText: '14m ago', recordingUrl: 'Suresh_K_Compliance.mp3' },
    { id: 'f-3', type: 'RUDE BEHAVIOR', agent: 'Rohan A.', leadId: '#97611', timeText: '1h ago', recordingUrl: 'Rohan_A_RudeBehavior.mp3' },
  ];

  const evaluations: EvaluationItem[] = [
    { id: '#QC-8829', agent: 'Ayesha Khan', dateTime: '24 May, 11:45 AM', campaign: 'Personal Loan', score: 88, auditor: 'Vikram S.', details: { greeting: 20, verification: 20, probing: 18, pitching: 15, closure: 15 } },
    { id: '#QC-8827', agent: 'Rahul K.', dateTime: '24 May, 10:20 AM', campaign: 'Auto-Loan', score: 54, auditor: 'Anjali P.', details: { greeting: 10, verification: 15, probing: 10, pitching: 9, closure: 10 } },
    { id: '#QC-8825', agent: 'Amit V.', dateTime: '24 May, 09:55 AM', campaign: 'Inbound-CC', score: 71, auditor: 'Vikram S.', details: { greeting: 15, verification: 15, probing: 15, pitching: 11, closure: 15 } },
    { id: '#QC-8821', agent: 'Sneha P.', dateTime: '23 May, 04:12 PM', campaign: 'Premium Fill', score: 92, auditor: 'Anjali P.', details: { greeting: 20, verification: 20, probing: 20, pitching: 17, closure: 15 } },
    { id: '#QC-8818', agent: 'Ravi S.', dateTime: '23 May, 02:30 PM', campaign: 'First-Call', score: 65, auditor: 'Vikram S.', details: { greeting: 12, verification: 14, probing: 12, pitching: 12, closure: 15 } },
  ];

  // Simulating audio ticking
  useEffect(() => {
    let timer: any;
    if (audioIsPlaying && activeAudio) {
      timer = setInterval(() => {
        setAudioProgress((p) => {
          if (p >= 100) {
            setAudioIsPlaying(false);
            return 0;
          }
          return p + 2;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [audioIsPlaying, activeAudio]);

  const handleListenRecording = (item: FatalFeedItem) => {
    setActiveAudio(item);
    setAudioProgress(0);
    setAudioIsPlaying(true);
  };

  const triggerBookCalibration = (agent: string, campaign: string) => {
    setCalibAgentName(agent);
    setCalibCampaign(campaign);
    setCalibrationModalOpen(true);
  };

  const submitCalibration = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Calibration Session successfully booked for ${calibAgentName} on ${calibDate}!`);
    setCalibrationModalOpen(false);
  };

  return (
    <main className="p-6 pt-1 space-y-6 bg-background">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">QC Console</h2>
          <p className="text-sm text-gray-500">Operational quality oversight &amp; fatal error tracking</p>
        </div>
        <div className="flex gap-2 relative">
          <button 
            onClick={() => triggerBookCalibration('', 'Auto-Loan')}
            className="bg-[#0056c3] text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2 hover:opacity-90 shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">calendar_month</span>
            Book Calibration
          </button>

          <div 
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="bg-white border border-outline-variant px-3 py-2 rounded text-gray-600 text-sm flex items-center gap-2 cursor-pointer hover:bg-gray-50 select-none"
          >
            <span className="material-symbols-outlined text-lg">filter_alt</span>
            {timeFilter === '7days' ? 'Last 7 Days' : timeFilter === '30days' ? 'Last 30 Days' : 'Today'}
            <span className="material-symbols-outlined text-xs">arrow_drop_down</span>
          </div>

          {showFilterMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-outline-variant rounded shadow-lg z-50 py-1 w-40 text-xs font-semibold">
              <div 
                onClick={() => { setTimeFilter('today'); setShowFilterMenu(false); }} 
                className={`px-3 py-2 hover:bg-surface-container-low cursor-pointer ${timeFilter === 'today' ? 'text-primary font-bold' : ''}`}
              >
                Today
              </div>
              <div 
                onClick={() => { setTimeFilter('7days'); setShowFilterMenu(false); }} 
                className={`px-3 py-2 hover:bg-surface-container-low cursor-pointer ${timeFilter === '7days' ? 'text-primary font-bold' : ''}`}
              >
                Last 7 Days
              </div>
              <div 
                onClick={() => { setTimeFilter('30days'); setShowFilterMenu(false); }} 
                className={`px-3 py-2 hover:bg-surface-container-low cursor-pointer ${timeFilter === '30days' ? 'text-primary font-bold' : ''}`}
              >
                Last 30 Days
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-4 shadow-sm border border-outline-variant rounded">
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Overall QC Score</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-primary">{currentKpis.score}</span>
            <span className="text-xs text-green-600 font-bold mb-1 flex items-center">
              <span className="material-symbols-outlined text-sm">trending_up</span> {currentKpis.scoreTrend}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 shadow-sm border border-outline-variant rounded">
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Fatal Error Rate</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-error">{currentKpis.fatal}</span>
            <span className="text-xs text-error font-bold mb-1 flex items-center">
              <span className="material-symbols-outlined text-sm">priority_high</span> High
            </span>
          </div>
        </div>
        <div className="bg-white p-4 shadow-sm border border-outline-variant rounded">
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Audits Completed</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-900">{currentKpis.completed}</span>
            <span className="text-xs text-gray-400 font-medium mb-1">MTD</span>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-12 gap-6">
        {/* Performance Declines (7 columns) */}
        <div className="col-span-7 bg-white shadow-sm border border-outline-variant rounded overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-outline-variant bg-gray-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-900 uppercase">Performance Declines (3-Week Trend)</h3>
            <span className="text-[10px] font-bold bg-error text-white px-2 py-0.5 rounded">ALERT</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-outline-variant bg-white">
                <th className="px-4 py-2 font-semibold text-left">Caller Name</th>
                <th className="px-4 py-2 font-semibold text-center">Score</th>
                <th className="px-4 py-2 font-semibold text-center">Trend</th>
                <th className="px-4 py-2 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {declines.map((d, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-bold">{d.name}</p>
                    <p className="text-xs text-gray-500">Campaign: {d.campaign}</p>
                  </td>
                  <td className="px-4 py-3 text-center font-bold">{d.score}</td>
                  <td className="px-4 py-3 text-center text-error font-bold">{d.trend}</td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => triggerBookCalibration(d.name, d.campaign)}
                      className="text-[11px] font-bold text-primary border border-primary px-3 py-1 rounded hover:bg-primary/5 transition-colors"
                    >
                      Book Calibration
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fatal Error Feed (5 columns) */}
        <div className="col-span-5 bg-white shadow-sm border border-outline-variant rounded flex flex-col">
          <div className="px-4 py-3 border-b border-outline-variant bg-red-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-error uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">report</span>
              Fatal Error Feed
            </h3>
            <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">LIVE</span>
          </div>
          <div className="flex-grow overflow-y-auto max-h-[280px] divide-y divide-outline-variant">
            {fatals.map((f) => (
              <div key={f.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-xs font-bold text-error mb-1">{f.type}</p>
                    <p className="text-sm font-bold">{f.agent}</p>
                    <p className="text-xs text-gray-500">Lead ID: {f.leadId}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{f.timeText}</span>
                </div>
                <button 
                  onClick={() => handleListenRecording(f)}
                  className={`w-full py-1.5 border rounded text-[11px] font-bold flex items-center justify-center gap-2 transition-all ${
                    activeAudio?.id === f.id
                      ? 'bg-[#0056c3] text-white border-[#0056c3]'
                      : 'border-outline-variant text-[#0056c3] hover:bg-gray-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {activeAudio?.id === f.id && audioIsPlaying ? 'pause' : 'play_arrow'}
                  </span> 
                  {activeAudio?.id === f.id ? 'Listening...' : 'Listen Recording'}
                </button>
              </div>
            ))}
          </div>
          <button 
            onClick={() => alert('Viewing complete list of 12 active fatal error audits...')}
            className="w-full py-3 text-xs font-bold text-primary border-t border-outline-variant hover:bg-gray-50"
          >
            View All Fatals
          </button>
        </div>
      </div>

      {/* Floating Call Recording Player (shows when playing fatal recording) */}
      {activeAudio && (
        <div className="bg-[#1b1c1c] text-white p-4 border border-outline rounded flex items-center justify-between gap-4 fixed bottom-4 right-4 max-w-sm w-full shadow-2xl z-50 animate-bounce-custom">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              onClick={() => setAudioIsPlaying(!audioIsPlaying)}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:brightness-110 flex-shrink-0"
            >
              <span className="material-symbols-outlined text-sm">{audioIsPlaying ? 'pause' : 'play_arrow'}</span>
            </button>
            <div className="flex-grow min-w-0">
              <p className="text-[10px] text-gray-400 font-bold uppercase truncate">{activeAudio.type} Recording</p>
              <p className="text-xs font-bold truncate">{activeAudio.agent} (ID: {activeAudio.leadId})</p>
              <div className="h-1 w-full bg-[#303030] rounded-full overflow-hidden mt-1 relative">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${audioProgress}%` }}></div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => { setActiveAudio(null); setAudioIsPlaying(false); }}
            className="text-gray-400 hover:text-white"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}

      {/* Recent Evaluations Table */}
      <div className="bg-white shadow-sm border border-outline-variant rounded overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Recent QC Evaluations</h3>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">
              Showing <span className="font-bold text-gray-900">{evalPage === 1 ? '1-5' : '6-10'}</span> of 10
            </span>
            <div className="flex border border-outline-variant rounded overflow-hidden select-none">
              <button 
                onClick={() => setEvalPage(1)}
                disabled={evalPage === 1}
                className="px-2 py-1 hover:bg-gray-50 border-r border-outline-variant disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <button 
                onClick={() => setEvalPage(2)}
                disabled={evalPage === 2}
                className="px-2 py-1 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b border-outline-variant text-[11px] uppercase tracking-wider font-bold">
                <th className="px-6 py-3 text-left">Eval ID</th>
                <th className="px-6 py-3 text-left">Agent Name</th>
                <th className="px-6 py-3 text-left">Date &amp; Time</th>
                <th className="px-6 py-3 text-left">Campaign</th>
                <th className="px-6 py-3 text-center">Score</th>
                <th className="px-6 py-3 text-left">Auditor</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {(evalPage === 1 ? evaluations : evaluations.slice().reverse()).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-primary">{item.id}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{item.agent}</td>
                  <td className="px-6 py-4 text-gray-500">{item.dateTime}</td>
                  <td className="px-6 py-4 text-gray-500">{item.campaign}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${item.score >= 80 ? 'bg-green-500' : item.score >= 65 ? 'bg-yellow-500' : 'bg-error'}`}></span>
                      <span className={`font-bold ${item.score >= 80 ? 'text-green-600' : item.score >= 65 ? 'text-yellow-600' : 'text-error'}`}>{item.score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{item.auditor}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => { setSelectedEval(item); setEvaluationModalOpen(true); }}
                      className="material-symbols-outlined text-gray-400 hover:text-primary"
                    >
                      visibility
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-outline-variant">
          <button 
            onClick={() => alert('Navigating to full audit log view...')}
            className="text-xs font-bold text-primary flex items-center gap-2 hover:gap-3 transition-all uppercase"
          >
            View Complete Audit History
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Book Calibration Modal */}
      {calibrationModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <form onSubmit={submitCalibration} className="bg-white border border-outline-variant max-w-sm w-full p-6 rounded shadow-xl space-y-4">
            <h3 className="font-bold text-sm uppercase border-b pb-2 border-outline-variant">
              Book Calibration Session
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-outline font-bold uppercase block mb-1">Agent Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Rahul K."
                  value={calibAgentName}
                  onChange={(e) => setCalibAgentName(e.target.value)}
                  className="w-full bg-white border border-outline-variant p-2 rounded focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-outline font-bold uppercase block mb-1">Campaign</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Auto-Loan"
                  value={calibCampaign}
                  onChange={(e) => setCalibCampaign(e.target.value)}
                  className="w-full bg-white border border-outline-variant p-2 rounded focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-outline font-bold uppercase block mb-1">Topic</label>
                <select 
                  value={calibTopic}
                  onChange={(e) => setCalibTopic(e.target.value)}
                  className="w-full bg-white border border-outline-variant p-2 rounded focus:ring-1 focus:ring-primary outline-none"
                >
                  <option>Objection Handling</option>
                  <option>Professional Greeting</option>
                  <option>Package Pitching</option>
                  <option>Verbiage / Rude Behavior Calibration</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-outline font-bold uppercase block mb-1">Date</label>
                <input 
                  type="date" 
                  required
                  value={calibDate}
                  onChange={(e) => setCalibDate(e.target.value)}
                  className="w-full bg-white border border-outline-variant p-2 rounded focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2 border-t border-outline-variant">
              <button 
                type="button" 
                onClick={() => setCalibrationModalOpen(false)}
                className="px-4 py-1.5 border border-outline-variant rounded font-bold hover:bg-gray-50 text-[11px]"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-1.5 bg-primary text-white rounded font-bold text-[11px] hover:brightness-110"
              >
                Book Session
              </button>
            </div>
          </form>
        </div>
      )}

      {/* View Evaluation Details Modal */}
      {evaluationModalOpen && selectedEval && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white border border-outline-variant max-w-md w-full p-6 rounded shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-2 border-outline-variant">
              <h3 className="font-bold text-sm uppercase">
                Evaluation Details ({selectedEval.id})
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${selectedEval.score >= 80 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Score: {selectedEval.score}%
              </span>
            </div>
            <div className="space-y-3 text-xs font-semibold">
              <p><strong>Agent:</strong> {selectedEval.agent}</p>
              <p><strong>Audited on:</strong> {selectedEval.dateTime}</p>
              <p><strong>Campaign:</strong> {selectedEval.campaign}</p>
              <p><strong>Audited by:</strong> {selectedEval.auditor}</p>

              <div className="pt-2 border-t border-outline-variant space-y-2">
                <h4 className="text-[10px] text-outline uppercase font-bold">Compliance Parameters</h4>
                <div className="flex justify-between p-2 bg-surface-container-low rounded">
                  <span>Professional Greeting</span>
                  <span className="text-primary">{selectedEval.details.greeting}/20</span>
                </div>
                <div className="flex justify-between p-2 bg-surface-container-low rounded">
                  <span>Customer Verification</span>
                  <span className="text-primary">{selectedEval.details.verification}/20</span>
                </div>
                <div className="flex justify-between p-2 bg-surface-container-low rounded">
                  <span>Probing &amp; Identification</span>
                  <span className="text-primary">{selectedEval.details.probing}/20</span>
                </div>
                <div className="flex justify-between p-2 bg-surface-container-low rounded">
                  <span>Package Pitching</span>
                  <span className="text-primary">{selectedEval.details.pitching}/20</span>
                </div>
                <div className="flex justify-between p-2 bg-surface-container-low rounded">
                  <span>Call Closure</span>
                  <span className="text-primary">{selectedEval.details.closure}/20</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t border-outline-variant">
              <button 
                onClick={() => setEvaluationModalOpen(false)}
                className="px-4 py-1.5 bg-primary text-white rounded font-bold text-[11px] hover:brightness-110"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Page06QcConsole;
