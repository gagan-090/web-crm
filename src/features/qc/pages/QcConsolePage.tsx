import React, { useState, useEffect } from 'react';
import KPIWidget from '../../../shared/components/business/KPIWidget';

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
Fatal Error Status: ${fatalErrorChecked ? 'FATAL ERROR TRIGGERED' : 'NONE'}`);
  };

  return (
    <div className="space-y-md">
      {/* QC Audits Metrics */}
      <div className="grid grid-cols-4 gap-md">
        <KPIWidget title="Quality Audit Target" value="12 / 20 Calls" subtext="8 remaining in queue" icon="rate_review" />
        <KPIWidget title="Team Average Score" value="84.2%" subtext="Target: >85.0%" icon="trending_up" />
        <KPIWidget title="Fatal error counts" value="1 Alert" subtext="Attributed to WCT Agent 10" color="text-error" icon="warning" />
        <KPIWidget title="Checked Compliance" value="94.2%" subtext="Script compliance score" icon="assignment_turned_in" />
      </div>

      {/* Audit Workspace */}
      <div className="grid grid-cols-12 gap-md items-start">
        
        {/* Audio Player and Checklists (8 columns) */}
        <div className="col-span-8 space-y-md">
          {/* Audio recording player */}
          <div className="bg-[#1b1c1c] text-white p-md border border-outline rounded-sm flipkart-shadow">
            <h4 className="text-xs font-bold uppercase text-outline mb-sm">Call Recording Player</h4>
            <div className="flex items-center gap-md">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary-container"
              >
                <span className="material-symbols-outlined">{isPlaying ? 'pause' : 'play_arrow'}</span>
              </button>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] text-outline mb-xs">
                  <span>DW Agent 04 - Rajesh Kumar</span>
                  <span>{audioDuration}</span>
                </div>
                {/* scrub bar */}
                <div className="h-1.5 w-full bg-[#303030] rounded-full overflow-hidden cursor-pointer">
                  <div className="h-full bg-primary" style={{ width: `${audioProgress}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* QC Compliance Score Sheet */}
          <div className="bg-white p-lg border border-outline-variant rounded-sm flipkart-shadow">
            <h3 className="font-headline-md text-xs font-extrabold uppercase text-on-surface mb-md">
              QC Compliance Score Checklist
            </h3>

            <div className="space-y-md">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className="flex items-center justify-between p-sm border border-outline-variant rounded-sm bg-surface-container-low cursor-pointer hover:border-primary transition-colors"
                >
                  <div className="flex items-center gap-sm">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => {}} // toggled by row click
                      className="rounded-sm border-outline-variant"
                    />
                    <span className="text-xs text-on-surface font-semibold">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-primary">+{item.points} pts</span>
                </div>
              ))}
            </div>

            {/* Fatal error log checklist */}
            <div className="mt-lg pt-md border-t border-outline-variant space-y-sm">
              <h4 className="font-bold text-xs uppercase text-error">Fatal Error Log</h4>
              <div
                onClick={() => setFatalErrorChecked(!fatalErrorChecked)}
                className={`flex items-center gap-sm p-sm border rounded-sm cursor-pointer transition-colors ${
                  fatalErrorChecked ? 'bg-error-container border-error text-on-error-container' : 'bg-surface-container-low border-outline-variant'
                }`}
              >
                <input
                  type="checkbox"
                  checked={fatalErrorChecked}
                  onChange={() => {}}
                  className="rounded-sm border-outline-variant text-error focus:ring-error"
                />
                <div className="text-xs">
                  <p className="font-bold">Trigger Fatal Error Audit</p>
                  <p className="text-[10px] text-outline">Checking this overrides final call score to 0% immediately (Rude behavior / incorrect product configurations).</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Scoring Panel (4 columns) */}
        <div className="col-span-4 bg-white border border-outline-variant rounded-sm p-md flipkart-shadow text-center space-y-md">
          <h3 className="font-headline-md text-xs font-extrabold uppercase text-outline text-left border-b border-outline-variant pb-xs">
            Audit Assessment Score
          </h3>

          {/* score radial simulation */}
          <div className="py-md">
            <div className={`w-32 h-32 rounded-full border-8 mx-auto flex flex-col justify-center items-center ${
              fatalErrorChecked ? 'border-error text-error bg-error-container/30' : 'border-primary text-primary bg-primary-fixed/30'
            }`}>
              <span className="text-2xl font-extrabold">{score}%</span>
              <span className="text-[9px] uppercase tracking-wider text-outline font-bold">Audit Mark</span>
            </div>
          </div>

          <div className="text-left text-xs space-y-xs">
            <label className="font-semibold text-outline">Quality Feedback Comments</label>
            <textarea
              rows={4}
              placeholder="Enter audit feedback remarks for training hub updates..."
              className="w-full px-sm py-xs border border-outline-variant rounded-sm outline-none focus:ring-1 focus:ring-primary text-xs"
            />
          </div>

          <button
            onClick={handleAuditSubmit}
            className="w-full bg-[#2874F0] hover:bg-primary-container text-white font-bold py-sm rounded-sm text-xs"
          >
            SUBMIT QUALITY AUDIT
          </button>
        </div>
      </div>
    </div>
  );
};
export default QcConsolePage;
