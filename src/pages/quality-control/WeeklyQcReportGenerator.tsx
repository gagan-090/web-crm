import React, { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface ReportData {
  summary: string;
  crmQuality: string;
  calibrationScore: string;
  positives: string;
  improvements: string;
  fatalNotes: string;
  recommendations: string;
  weekLabel: string;
  reportDate: string;
  fatalCount: string;
}

// ── Toast ──────────────────────────────────────────────────────────────────────
interface ToastProps { message: string; type?: 'success' | 'info'; onClose: () => void }
const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => (
  <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium">
    <span className={`material-symbols-outlined text-base ${type === 'success' ? 'text-green-400' : 'text-amber-400'}`}>
      {type === 'success' ? 'check_circle' : 'info'}
    </span>
    {message}
    <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white">
      <span className="material-symbols-outlined text-sm">close</span>
    </button>
  </div>
);

// ── Initial Values ─────────────────────────────────────────────────────────────
const DEFAULTS: ReportData = {
  weekLabel:          'Week 20',
  reportDate:         'May 24, 2024',
  summary:            'The telecalling performance for Week 20 shows a steady 3% improvement in overall script compliance. Average audit score stabilized at 88.4% across 450 evaluated interactions. High-performing segments include Lead Qualification, while Follow-up Retention remains an area for calibration focus.',
  crmQuality:         '94.2',
  calibrationScore:   '91.0',
  fatalCount:         '04',
  positives:          'Empathy scores peaked in customer resolution calls.\nImproved closing rate in South Zone agents.\nZero "Agent Disconnect" incidents reported.',
  improvements:       '1. Objection handling during price negotiation.\n2. Adherence to CRM mandatory fields.\n3. Proactive alternative route suggestions.',
  fatalNotes:         '4 instances of unauthorized data sharing detected. Remedial training scheduled for Batch B.',
  recommendations:    'Mandatory \'Lead Engagement\' workshop for agents scoring below 75% in Week 20. Introduce gamification for CRM accuracy.',
};

// ── Score Distribution (derived) ───────────────────────────────────────────────
const SCORE_BANDS = [
  { label: 'Excellent (90%+)', pct: 64, color: 'bg-amber-500'  },
  { label: 'Standard (70-90%)', pct: 28, color: 'bg-slate-400' },
  { label: 'Needs Review (<70%)', pct: 8,  color: 'bg-red-500'  },
];

// ── Component ──────────────────────────────────────────────────────────────────
export const WeeklyQcReportGenerator: React.FC = () => {
  const [data, setData]       = useState<ReportData>(DEFAULTS);
  const [toast, setToast]     = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success'|'info'>('success');
  const [sending, setSending] = useState(false);

  const set = (field: keyof ReportData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData(prev => ({ ...prev, [field]: e.target.value }));

  const showToast = (msg: string, type: 'success'|'info' = 'success') => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      showToast('Report sent to Telecalling Head successfully!', 'success');
    }, 1500);
  };

  const handleExportPdf = () => {
    window.print();
    showToast('Print dialog opened — save as PDF.', 'info');
  };

  const handleReset = () => {
    setData(DEFAULTS);
    showToast('Report reset to defaults.', 'info');
  };

  // Parse positives for preview
  const positivesArr = data.positives.split('\n').filter(Boolean);

  return (
    <main className="w-full max-w-7xl mx-auto p-6 bg-white text-xs md:text-sm">
      {toast && <Toast message={toast} type={toastType} onClose={() => setToast(null)} />}

      {/* Page Header */}
      <div className="mb-6">
        <nav className="flex items-center gap-1 text-xs text-slate-400 mb-1">
          <span>Core</span>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-slate-700 font-semibold">Weekly QC Report</span>
        </nav>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl font-bold text-slate-800">Weekly QC Report Generator</h1>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Reset to Defaults
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-amber-600 transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {sending ? (
                <><span className="material-symbols-outlined text-sm animate-spin">sync</span> Sending…</>
              ) : (
                <><span className="material-symbols-outlined text-sm">send</span> Send to Head</>
              )}
            </button>
            <button
              onClick={handleExportPdf}
              className="border-2 border-amber-500 text-amber-500 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-amber-50 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
              Export PDF
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Preview Pane ─────────────────────────────────────────────────── */}
        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl overflow-y-auto p-8 max-h-[calc(100vh-200px)]">
          <div className="max-w-[680px] mx-auto space-y-8">

            {/* Report Header */}
            <div className="border-b-2 border-amber-500 pb-5 flex justify-between items-end">
              <div>
                <h2 className="text-lg font-black text-amber-500 uppercase tracking-wider">Quality Audit Report</h2>
                <p className="text-xs text-slate-500 mt-1">Operational Performance Summary</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Report Date</p>
                <p className="text-sm font-bold text-slate-700">{data.reportDate}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{data.weekLabel}</p>
              </div>
            </div>

            {/* Executive Summary */}
            <section>
              <h3 className="text-[10px] font-black text-amber-500 border-l-4 border-amber-500 pl-3 uppercase tracking-wider mb-3">Executive Summary</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{data.summary || '(No summary entered)'}</p>
            </section>

            {/* Score Distribution + Fatal Errors */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-wider mb-3">Score Distribution</h3>
                <div className="space-y-2">
                  {SCORE_BANDS.map(band => (
                    <div key={band.label}>
                      <div className="flex justify-between text-[11px] text-slate-600 mb-0.5">
                        <span>{band.label}</span>
                        <span className="font-bold">{band.pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full ${band.color} rounded-full`} style={{ width: `${band.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-wider mb-3">Fatal Errors</h3>
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-3xl font-black text-red-700">{data.fatalCount}</p>
                  <p className="text-[11px] text-red-600 mt-1">Compliance Breaches Identified</p>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CRM Data Quality</p>
                <p className="text-2xl font-black text-slate-800 mt-1">{data.crmQuality}%</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Calibration Score</p>
                <p className="text-2xl font-black text-slate-800 mt-1">{data.calibrationScore}%</p>
              </div>
            </div>

            {/* Notable Positives */}
            <section className="border-t border-slate-200 pt-5">
              <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-wider mb-3">Notable Positives</h3>
              {positivesArr.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No positives added yet.</p>
              ) : (
                <ul className="space-y-1">
                  {positivesArr.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="material-symbols-outlined text-green-500 text-[14px] mt-0.5 flex-shrink-0">check_circle</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Improvement Areas */}
            <section className="border-t border-slate-200 pt-5">
              <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-wider mb-3">Top Improvement Areas</h3>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">{data.improvements}</p>
            </section>

            {/* Fatal Notes */}
            <section className="border-t border-slate-200 pt-5">
              <h3 className="text-[10px] font-black text-red-600 uppercase tracking-wider mb-3">Fatal Error Notes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{data.fatalNotes}</p>
            </section>

            {/* Recommendations */}
            <section className="border-t border-slate-200 pt-5">
              <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-wider mb-3">Final Recommendations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{data.recommendations}</p>
            </section>

            {/* Footer */}
            <div className="pt-8 flex justify-between items-center text-[10px] text-slate-300 border-t border-slate-100">
              <span>© 2024 TruckMitr QC System | Internal Confidential</span>
              <span>Page 01 of 01</span>
            </div>
          </div>
        </div>

        {/* ── Editor Pane ───────────────────────────────────────────────────── */}
        <div className="w-full lg:w-[380px] flex flex-col gap-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="material-symbols-outlined text-amber-500 text-base">edit_document</span>
              <h2 className="text-sm font-bold text-slate-800">Report Editor</h2>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Week Label</label>
                <input
                  type="text"
                  value={data.weekLabel}
                  onChange={set('weekLabel')}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Report Date</label>
                <input
                  type="text"
                  value={data.reportDate}
                  onChange={set('reportDate')}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Executive Summary */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Executive Summary</label>
              <textarea
                value={data.summary}
                onChange={set('summary')}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-400 h-28 resize-none"
                placeholder="Enter executive summary…"
              />
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CRM Quality %</label>
                <input
                  type="number"
                  value={data.crmQuality}
                  onChange={set('crmQuality')}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Calibration %</label>
                <input
                  type="number"
                  value={data.calibrationScore}
                  onChange={set('calibrationScore')}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fatals</label>
                <input
                  type="text"
                  value={data.fatalCount}
                  onChange={set('fatalCount')}
                  className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Positives */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Notable Positives (one per line)</label>
              <textarea
                value={data.positives}
                onChange={set('positives')}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-400 h-20 resize-none"
              />
            </div>

            {/* Improvements */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Top 3 Improvement Areas</label>
              <textarea
                value={data.improvements}
                onChange={set('improvements')}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-400 h-20 resize-none"
              />
            </div>

            {/* Fatal Notes */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Fatal Error Notes</label>
              <textarea
                value={data.fatalNotes}
                onChange={set('fatalNotes')}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-400 h-16 resize-none"
              />
            </div>

            {/* Recommendations */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Final Recommendations</label>
              <textarea
                value={data.recommendations}
                onChange={set('recommendations')}
                className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-400 h-20 resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleSend}
              disabled={sending}
              className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {sending ? (
                <><span className="material-symbols-outlined text-base animate-spin">sync</span> Sending Report…</>
              ) : (
                <><span className="material-symbols-outlined text-base">send</span> Send to Telecalling Head</>
              )}
            </button>
            <button
              onClick={handleExportPdf}
              className="w-full py-3 border-2 border-amber-500 text-amber-500 rounded-xl font-bold text-sm hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">picture_as_pdf</span>
              Export as PDF
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WeeklyQcReportGenerator;
