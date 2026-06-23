import React, { useState, useEffect } from 'react';

interface CheckboxItem {
  id: string;
  label: string;
  points: number;
  checked: boolean;
}

export const QcConsolePage: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(30); // in percent
  const [audioDuration] = useState('04:12');
  const [fatalErrorChecked, setFatalErrorChecked] = useState(false);
  const [comments, setComments] = useState('');

  const [checklist, setChecklist] = useState<CheckboxItem[]>([
    { id: '1', label: 'Professional Greeting (Hindi/English)', points: 20, checked: true },
    { id: '2', label: 'Customer verification & Lead validation', points: 20, checked: true },
    { id: '3', label: 'Needs identification & problem probing', points: 20, checked: true },
    { id: '4', label: 'Price package pitching & Fastag combo offering', points: 20, checked: false },
    { id: '5', label: 'Call closure & Callback confirmation logging', points: 20, checked: true }
  ]);

  // Audio player simulator progress tick
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleCheck = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  // Score calculation
  const score = fatalErrorChecked
    ? 0
    : checklist.reduce((acc, curr) => (curr.checked ? acc + curr.points : acc), 0);

  const handleAuditSubmit = () => {
    alert(`Audit submitted successfully!
Final Score: ${score}%
Fatal Error Status: ${fatalErrorChecked ? 'FATAL ERROR TRIGGERED' : 'NONE'}
Comments: ${comments || 'No remarks provided.'}`);
  };

  return (
    <main className="bg-white w-full max-w-7xl mx-auto p-6 space-y-6 relative text-xs md:text-sm">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-slate-200 rounded-2xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">QC Console</h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">Perform audits, calculate compliance scores, and log fatal errors.</p>
        </div>
      </div>

      {/* QC Audits Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Quality Audit Target */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">rate_review</span>
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Quality Audit Target</p>
            <p className="text-xl md:text-2xl font-black text-slate-800 mt-0.5">12 / 20 Calls</p>
            <p className="text-[10px] text-slate-400 mt-0.5">8 remaining in queue</p>
          </div>
        </div>
        
        {/* Team Average Score */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">trending_up</span>
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Team Average Score</p>
            <p className="text-xl md:text-2xl font-black text-slate-800 mt-0.5">84.2%</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Target: &gt;85.0%</p>
          </div>
        </div>

        {/* Fatal error counts */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-650 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Fatal Error Counts</p>
            <p className="text-xl md:text-2xl font-black text-red-600 mt-0.5">1 Alert</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Attributed to WCT Agent 10</p>
          </div>
        </div>

        {/* Checked Compliance */}
        <div className="bg-white p-5 border border-slate-200 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">assignment_turned_in</span>
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">Checked Compliance</p>
            <p className="text-xl md:text-2xl font-black text-slate-800 mt-0.5">94.2%</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Script compliance score</p>
          </div>
        </div>
      </div>

      {/* Audit Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Audio Player and Checklists (8 columns) */}
        <div className="col-span-1 lg:col-span-8 space-y-6">
          
          {/* Audio recording player */}
          <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Call Recording Player</h3>
            
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-150 rounded-xl p-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-all active:scale-95 shrink-0"
              >
                <span className="material-symbols-outlined text-lg">{isPlaying ? 'pause' : 'play_arrow'}</span>
              </button>
              <div className="flex-1">
                <div className="flex justify-between text-xs text-slate-500 font-bold mb-1.5">
                  <span className="text-slate-800">DW Agent 04 - Rajesh Kumar</span>
                  <span className="font-mono">{audioDuration}</span>
                </div>
                {/* scrub bar */}
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden cursor-pointer" onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newProgress = Math.round((clickX / rect.width) * 100);
                  setAudioProgress(newProgress);
                }}>
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${audioProgress}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* QC Compliance Score Sheet */}
          <div className="bg-white p-6 border border-slate-200 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-450 tracking-wider">
              QC Compliance Score Checklist
            </h3>

            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`flex items-center justify-between p-3.5 border rounded-xl cursor-pointer transition-all ${
                    item.checked 
                      ? 'bg-slate-50/50 border-amber-500 text-slate-800 font-bold' 
                      : 'bg-white border-slate-200 hover:border-slate-350 text-slate-650 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => {}} // toggled by row click
                      className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 border-slate-300"
                    />
                    <span className="text-xs md:text-sm font-semibold">{item.label}</span>
                  </div>
                  <span className="text-xs md:text-sm font-black text-amber-500">+{item.points} pts</span>
                </div>
              ))}
            </div>

            {/* Fatal error log checklist */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h4 className="text-xs font-bold uppercase text-red-500 tracking-wider">Fatal Error Log</h4>
              <div
                onClick={() => setFatalErrorChecked(!fatalErrorChecked)}
                className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                  fatalErrorChecked 
                    ? 'bg-red-50 border-red-200 text-red-700 font-bold' 
                    : 'bg-white border-slate-200 hover:border-slate-350 text-slate-650'
                }`}
              >
                <input
                  type="checkbox"
                  checked={fatalErrorChecked}
                  onChange={() => {}}
                  className="rounded text-red-650 focus:ring-red-500 w-4 h-4 border-slate-300"
                />
                <div className="text-xs md:text-sm">
                  <p className="font-extrabold text-red-700">Trigger Fatal Error Audit</p>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">Checking this overrides final call score to 0% immediately (Rude behavior / incorrect product configurations).</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Scoring Panel (4 columns) */}
        <div className="col-span-1 lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider text-left border-b border-slate-150 pb-2">
              Audit Assessment Score
            </h3>

            {/* score radial simulation */}
            <div className="py-4">
              <div className={`w-32 h-32 rounded-full border-8 mx-auto flex flex-col justify-center items-center transition-all ${
                fatalErrorChecked 
                  ? 'border-red-500 text-red-600 bg-red-50' 
                  : 'border-amber-500 text-amber-600 bg-amber-50/30'
              }`}>
                <span className="text-3xl font-black">{score}%</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mt-1">Audit Mark</span>
              </div>
            </div>

            <div className="text-left text-xs md:text-sm space-y-2">
              <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Quality Feedback Comments</label>
              <textarea
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter audit feedback remarks for training hub updates..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-amber-500 text-xs md:text-sm font-semibold text-slate-700"
              />
            </div>
          </div>

          <button
            onClick={handleAuditSubmit}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl text-xs md:text-sm transition-all active:scale-[0.98]"
          >
            SUBMIT QUALITY AUDIT
          </button>
        </div>
      </div>
    </main>
  );
};

export default QcConsolePage;
