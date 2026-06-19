import React, { useState } from 'react';
import { useClickToCall } from '../../shared/hooks/useClickToCall';

interface JobSla {
  id: string;
  transporter: string;
  plan: 'PREMIUM' | 'STANDARD PLUS';
  postedDate: string;
  slaDeadline: string;
  remainingDays: number;
  remainingText: string;
  caller: string;
  calls: number;
  status: 'HEALTHY' | 'AT RISK' | 'CRITICAL' | 'ESCALATED';
}

interface TransporterOnboarding {
  id: string;
  name: string;
  location: string;
  status: 'OVERDUE' | '14m REMAINING' | 'NEW' | 'ASSIGNED';
  registeredText: string;
  mobile: string;
}

interface BreachLog {
  timestamp: string;
  entityId: string;
  breachType: string;
  owner: string;
  actionTaken: string;
}

export const SlaDashboard: React.FC = () => {
  const { triggerCall } = useClickToCall();

  // State
  const [jobs, setJobs] = useState<JobSla[]>([
    { id: '#JOB-8842', transporter: 'VRL Logistics Ltd', plan: 'PREMIUM', postedDate: '22 Oct, 2023', slaDeadline: '26 Oct, 18:00', remainingDays: 1.2, remainingText: '1.2 Days', caller: 'Rahul S.', calls: 14, status: 'CRITICAL' },
    { id: '#JOB-8901', transporter: 'Safe Express India', plan: 'STANDARD PLUS', postedDate: '23 Oct, 2023', slaDeadline: '27 Oct, 12:00', remainingDays: 3.5, remainingText: '3.5 Days', caller: 'Priya M.', calls: 8, status: 'AT RISK' },
    { id: '#JOB-9012', transporter: 'BlueDart Surface', plan: 'PREMIUM', postedDate: '24 Oct, 2023', slaDeadline: '30 Oct, 18:00', remainingDays: 6.0, remainingText: '6.0 Days', caller: 'Ankit K.', calls: 2, status: 'HEALTHY' }
  ]);

  const [onboardings, setOnboardings] = useState<TransporterOnboarding[]>([
    { id: 'TR-102', name: 'Jaguar Roadlines', location: 'Ahmedabad, GJ', status: 'OVERDUE', registeredText: '3h 42m ago', mobile: '+91 99887-76655' },
    { id: 'TR-103', name: 'KTC Transport', location: 'Ludhiana, PB', status: '14m REMAINING', registeredText: '1h 46m ago', mobile: '+91 91234-56789' },
    { id: 'TR-104', name: 'Delhi Cargo Services', location: 'Delhi, DL', status: 'NEW', registeredText: '12m ago', mobile: '+91 98765-43210' }
  ]);

  const [breaches] = useState<BreachLog[]>([
    { timestamp: '24 Oct, 09:15', entityId: '#JOB-8722', breachType: 'Unassigned > 24h', owner: 'System Admin', actionTaken: 'Auto-Assigned' },
    { timestamp: '23 Oct, 18:00', entityId: 'TR-9921 (ABC Trns)', breachType: 'Call SLA Breach', owner: 'Rohit Verma', actionTaken: 'Manager Notified' },
    { timestamp: '23 Oct, 14:45', entityId: '#JOB-8650', breachType: 'No Call > 48h', owner: 'Sunita Devi', actionTaken: 'Job Re-queued' }
  ]);

  // Modal State
  const [selectedJob, setSelectedJob] = useState<JobSla | null>(null);
  const [assigningTransporter, setAssigningTransporter] = useState<TransporterOnboarding | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newSlaType, setNewSlaType] = useState<'job' | 'onboarding'>('job');

  // Form State
  const [formTransporter, setFormTransporter] = useState('');
  const [formPlan, setFormPlan] = useState<'PREMIUM' | 'STANDARD PLUS'>('PREMIUM');
  const [formDeadline, setFormDeadline] = useState('');
  const [formCaller, setFormCaller] = useState('Rahul S.');
  const [formLocation, setFormLocation] = useState('');
  const [formMobile, setFormMobile] = useState('');

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Actions
  const handleEscalate = (id: string) => {
    setJobs(prev => prev.map(job => {
      if (job.id === id) {
        showToast(`Escalated SLA for ${job.transporter}. Alert sent to Operations Head.`);
        return { ...job, status: 'ESCALATED' };
      }
      return job;
    }));
  };

  const handleCall = (name: string, phone: string) => {
    triggerCall(name, phone);
    showToast(`Dialing ${name} at ${phone}...`);
  };

  const handleAssign = (transporter: TransporterOnboarding, caller: string) => {
    setOnboardings(prev => prev.map(o => {
      if (o.id === transporter.id) {
        return { ...o, status: 'ASSIGNED', registeredText: `Assigned to ${caller}` };
      }
      return o;
    }));
    showToast(`Assigned ${transporter.name} to ${caller}`);
    setAssigningTransporter(null);
  };

  const handleCreateSla = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTransporter) {
      alert('Please enter a transporter name');
      return;
    }

    if (newSlaType === 'job') {
      const newJob: JobSla = {
        id: `#JOB-${Math.floor(8000 + Math.random() * 2000)}`,
        transporter: formTransporter,
        plan: formPlan,
        postedDate: 'Today',
        slaDeadline: formDeadline || '28 Oct, 18:00',
        remainingDays: 5.0,
        remainingText: '5.0 Days',
        caller: formCaller,
        calls: 0,
        status: 'HEALTHY'
      };
      setJobs([newJob, ...jobs]);
      showToast(`Created Active Job SLA for ${formTransporter}`);
    } else {
      const newOnboarding: TransporterOnboarding = {
        id: `TR-${Math.floor(100 + Math.random() * 900)}`,
        name: formTransporter,
        location: formLocation || 'Mumbai, MH',
        status: 'NEW',
        registeredText: 'Just now',
        mobile: formMobile || '+91 99999-99999'
      };
      setOnboardings([newOnboarding, ...onboardings]);
      showToast(`Logged onboarding SLA target for ${formTransporter}`);
    }

    // Reset Form
    setFormTransporter('');
    setFormLocation('');
    setFormMobile('');
    setIsCreateModalOpen(false);
  };

  const handleDownloadReport = () => {
    showToast('Preparing PDF breach history log report. Download will start automatically.');
  };

  return (
    <main className="flex flex-col bg-white min-h-screen relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-sm shadow-xl z-50 transition-all font-bold">
          {toast}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-md space-y-xl custom-scrollbar pb-24">
        {/* Active Job SLAs Section */}
        <section className="bg-white rounded border border-outline-variant shadow-sm overflow-hidden">
          <div className="px-md py-sm border-b border-outline-variant flex items-center justify-between">
            <h2 className="font-bold text-on-surface flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary animate-pulse" data-icon="pending_actions">pending_actions</span>
              Active Job SLAs
            </h2>
            <div className="flex items-center gap-sm">
              <div className="flex items-center gap-xs text-[11px]">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> <span>Safe (&gt;5d)</span>
              </div>
              <div className="flex items-center gap-xs text-[11px] ml-sm">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span> <span>At Risk (2-4d)</span>
              </div>
              <div className="flex items-center gap-xs text-[11px] ml-sm">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span> <span>Urgent (&lt;2d)</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-outline-variant">
                  <th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase">Job ID</th>
                  <th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase">Transporter</th>
                  <th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase">Plan</th>
                  <th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase">Posted Date</th>
                  <th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase">SLA Deadline</th>
                  <th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase text-center">Remaining</th>
                  <th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase">Caller</th>
                  <th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase text-center">Calls</th>
                  <th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase">Status</th>
                  <th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {jobs.map(job => (
                  <tr 
                    key={job.id} 
                    className={`hover:bg-slate-50/50 transition-colors ${
                      job.status === 'CRITICAL' ? 'bg-red-50/20' :
                      job.status === 'ESCALATED' ? 'bg-purple-50/30' :
                      job.status === 'AT RISK' ? 'bg-amber-50/10' : ''
                    }`}
                  >
                    <td className="px-md py-sm font-data-mono text-xs">{job.id}</td>
                    <td className="px-md py-sm font-bold text-slate-800">{job.transporter}</td>
                    <td className="px-md py-sm">
                      <span className={`px-sm py-0.5 rounded text-[10px] font-bold ${
                        job.plan === 'PREMIUM' ? 'bg-secondary-container text-on-secondary-container' : 'border border-primary text-primary'
                      }`}>
                        {job.plan}
                      </span>
                    </td>
                    <td className="px-md py-sm text-xs">{job.postedDate}</td>
                    <td className={`px-md py-sm font-bold text-xs ${job.status === 'CRITICAL' || job.status === 'ESCALATED' ? 'text-error' : 'text-slate-700'}`}>
                      {job.slaDeadline}
                    </td>
                    <td className="px-md py-sm text-center">
                      <span className={`font-bold text-xs ${
                        job.status === 'CRITICAL' || job.status === 'ESCALATED' ? 'text-error' :
                        job.status === 'AT RISK' ? 'text-amber-700' : 'text-green-700'
                      }`}>{job.remainingText}</span>
                    </td>
                    <td className="px-md py-sm text-xs">{job.caller}</td>
                    <td className="px-md py-sm text-center text-xs">{job.calls}</td>
                    <td className="px-md py-sm">
                      <span className={`px-sm py-0.5 rounded text-[10px] font-bold ${
                        job.status === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                        job.status === 'ESCALATED' ? 'bg-purple-100 text-purple-800' :
                        job.status === 'AT RISK' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-md py-sm">
                      <div className="flex items-center gap-2">
                        {job.status !== 'ESCALATED' && job.status === 'CRITICAL' ? (
                          <button 
                            onClick={() => handleEscalate(job.id)}
                            className="bg-error text-white px-3 py-1 rounded text-[10px] font-bold shadow-sm hover:bg-red-700 active:scale-95 transition-all"
                          >
                            ESCALATE
                          </button>
                        ) : (
                          <button 
                            className="bg-slate-100 text-slate-400 px-3 py-1 rounded text-[10px] font-bold cursor-not-allowed"
                            disabled
                          >
                            {job.status === 'ESCALATED' ? 'ESCALATED' : 'ESCALATE'}
                          </button>
                        )}
                        <button 
                          onClick={() => setSelectedJob(job)}
                          className="border border-outline text-on-surface px-3 py-1 rounded text-[10px] font-bold hover:bg-slate-50 active:scale-95 transition-all"
                        >
                          VIEW
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* New Transporter Onboarding SLA Section */}
        <section className="space-y-sm">
          <div className="flex items-center justify-between px-xs">
            <h3 className="font-bold text-on-surface text-[12px] uppercase tracking-wider flex items-center gap-xs">
              <span className="material-symbols-outlined text-secondary" data-icon="handshake">handshake</span>
              New Transporter Onboarding SLA
            </h3>
            <span className="text-[10px] text-outline italic">Response required within 2 hours of registration</span>
          </div>
          <div className="grid grid-cols-3 gap-md">
            {onboardings.map(o => (
              <div 
                key={o.id}
                className="bg-white border border-outline-variant p-md rounded shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between"
              >
                <div className={`absolute top-0 right-0 w-1 h-full ${
                  o.status === 'OVERDUE' ? 'bg-error' :
                  o.status === '14m REMAINING' ? 'bg-amber-500' :
                  o.status === 'ASSIGNED' ? 'bg-primary' : 'bg-green-500'
                }`}></div>
                <div className="flex justify-between items-start mb-sm">
                  <div>
                    <h4 className="font-bold text-slate-800">{o.name}</h4>
                    <p className="text-[11px] text-outline">{o.location}</p>
                  </div>
                  <span className={`px-sm py-0.5 rounded text-[9px] font-extrabold ${
                    o.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                    o.status === '14m REMAINING' ? 'bg-amber-100 text-amber-800' :
                    o.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>{o.status}</span>
                </div>
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-[10px] text-outline uppercase font-bold">Registered</p>
                    <p className={`font-data-mono text-xs ${o.status === 'OVERDUE' ? 'text-error font-bold' : 'text-slate-700'}`}>
                      {o.registeredText}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCall(o.name, o.mobile)}
                      className="bg-secondary text-white text-[10px] font-bold px-3 py-1.5 rounded shadow hover:bg-opacity-90 active:scale-95 transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[12px]" data-icon="call">call</span>
                      CALL NOW
                    </button>
                    {o.status !== 'ASSIGNED' ? (
                      <button 
                        onClick={() => setAssigningTransporter(o)}
                        className="border border-secondary text-secondary text-[10px] font-bold px-3 py-1.5 rounded hover:bg-secondary-fixed active:scale-95 transition-all"
                      >
                        ASSIGN
                      </button>
                    ) : (
                      <button 
                        className="border border-outline text-outline text-[10px] font-bold px-3 py-1.5 rounded cursor-not-allowed"
                        disabled
                      >
                        ASSIGNED
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Breach History Log Section */}
        <section className="bg-white rounded border border-outline-variant shadow-sm">
          <div className="px-md py-sm border-b border-outline-variant flex items-center justify-between">
            <h3 className="font-bold text-on-surface flex items-center gap-sm">
              <span className="material-symbols-outlined text-outline" data-icon="history">history</span>
              Recent Breach History Log
            </h3>
            <button 
              onClick={handleDownloadReport}
              className="text-primary text-[11px] font-bold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]" data-icon="download">download</span>
              Download Report
            </button>
          </div>
          <div className="p-md">
            <div className="space-y-xs">
              <div className="grid grid-cols-5 text-[10px] font-bold text-outline-variant uppercase px-sm py-xs border-b border-outline-variant">
                <span>Timestamp</span>
                <span>Entity / Job ID</span>
                <span>Breach Type</span>
                <span>Owner</span>
                <span>Action Taken</span>
              </div>
              {breaches.map((log, idx) => (
                <div key={idx} className="grid grid-cols-5 text-[11px] px-sm py-sm border-b border-outline-variant/30 hover:bg-slate-50 transition-colors items-center">
                  <span className="font-data-mono">{log.timestamp}</span>
                  <span className="font-bold">{log.entityId}</span>
                  <span className="text-error font-bold">{log.breachType}</span>
                  <span>{log.owner}</span>
                  <span>
                    <span className="px-sm py-0.5 bg-slate-100 rounded font-semibold text-slate-700">
                      {log.actionTaken}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-lg right-lg bg-primary text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
      >
        <span className="material-symbols-outlined" data-icon="add">add</span>
      </button>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-md shadow-2xl w-[450px] border border-outline-variant max-w-full">
            <h3 className="text-sm font-extrabold uppercase mb-4 text-primary">Create New SLA Target</h3>
            <div className="flex gap-4 mb-4 border-b border-outline-variant pb-2">
              <button 
                type="button"
                onClick={() => setNewSlaType('job')}
                className={`pb-1 text-xs font-bold ${newSlaType === 'job' ? 'text-primary border-b-2 border-primary' : 'text-slate-400'}`}
              >
                Active Job SLA
              </button>
              <button 
                type="button"
                onClick={() => setNewSlaType('onboarding')}
                className={`pb-1 text-xs font-bold ${newSlaType === 'onboarding' ? 'text-primary border-b-2 border-primary' : 'text-slate-400'}`}
              >
                Transporter Onboarding SLA
              </button>
            </div>
            <form onSubmit={handleCreateSla} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-outline uppercase mb-1">Transporter Name</label>
                <input 
                  type="text" 
                  value={formTransporter}
                  onChange={(e) => setFormTransporter(e.target.value)}
                  className="w-full border border-outline-variant rounded p-2 text-xs focus:outline-none focus:border-primary"
                  placeholder="e.g. VRL Logistics"
                  required
                />
              </div>

              {newSlaType === 'job' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-outline uppercase mb-1">Plan</label>
                      <select 
                        value={formPlan}
                        onChange={(e) => setFormPlan(e.target.value as any)}
                        className="w-full border border-outline-variant rounded p-2 text-xs focus:outline-none focus:border-primary bg-white"
                      >
                        <option value="PREMIUM">Premium</option>
                        <option value="STANDARD PLUS">Standard Plus</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-outline uppercase mb-1">Assigned Caller</label>
                      <select 
                        value={formCaller}
                        onChange={(e) => setFormCaller(e.target.value)}
                        className="w-full border border-outline-variant rounded p-2 text-xs focus:outline-none focus:border-primary bg-white"
                      >
                        <option value="Rahul S.">Rahul S.</option>
                        <option value="Priya M.">Priya M.</option>
                        <option value="Ankit K.">Ankit K.</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-outline uppercase mb-1">SLA Deadline</label>
                    <input 
                      type="text" 
                      value={formDeadline}
                      onChange={(e) => setFormDeadline(e.target.value)}
                      className="w-full border border-outline-variant rounded p-2 text-xs focus:outline-none focus:border-primary"
                      placeholder="e.g. 28 Oct, 18:00"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-outline uppercase mb-1">Location</label>
                      <input 
                        type="text" 
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        className="w-full border border-outline-variant rounded p-2 text-xs focus:outline-none focus:border-primary"
                        placeholder="e.g. Mumbai, MH"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-outline uppercase mb-1">Mobile</label>
                      <input 
                        type="text" 
                        value={formMobile}
                        onChange={(e) => setFormMobile(e.target.value)}
                        className="w-full border border-outline-variant rounded p-2 text-xs focus:outline-none focus:border-primary"
                        placeholder="e.g. +91 99999-88888"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant">
                <button 
                  type="button" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-outline-variant rounded text-xs font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-primary text-white rounded text-xs font-bold hover:bg-primary-container shadow"
                >
                  Create Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Transporter Modal */}
      {assigningTransporter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-md shadow-2xl w-[400px] border border-outline-variant max-w-full">
            <h3 className="text-sm font-extrabold uppercase mb-4 text-primary">Assign Caller</h3>
            <p className="text-xs text-slate-600 mb-4">Select an executive to assign to onboarding transporter <span className="font-bold text-slate-800">{assigningTransporter.name}</span>:</p>
            <div className="space-y-2">
              {['Rahul S.', 'Priya M.', 'Ankit K.', 'Sunita Sharma'].map(caller => (
                <button 
                  key={caller}
                  onClick={() => handleAssign(assigningTransporter, caller)}
                  className="w-full text-left p-3 border border-outline-variant rounded hover:border-primary hover:bg-primary/5 transition-all text-xs font-semibold text-slate-800 flex items-center justify-between"
                >
                  <span>{caller}</span>
                  <span className="material-symbols-outlined text-[16px] text-slate-400" data-icon="chevron_right">chevron_right</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-outline-variant mt-6">
              <button 
                type="button" 
                onClick={() => setAssigningTransporter(null)}
                className="px-4 py-2 border border-outline-variant rounded text-xs font-bold hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-md shadow-2xl w-[450px] border border-outline-variant max-w-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-bold text-outline-variant font-data-mono">{selectedJob.id}</span>
                <h3 className="text-sm font-extrabold uppercase text-slate-800">{selectedJob.transporter}</h3>
              </div>
              <span className={`px-sm py-0.5 rounded text-[10px] font-bold ${
                selectedJob.status === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                selectedJob.status === 'ESCALATED' ? 'bg-purple-100 text-purple-800' :
                selectedJob.status === 'AT RISK' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
              }`}>{selectedJob.status}</span>
            </div>
            
            <div className="space-y-3 py-3 border-t border-b border-outline-variant my-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Plan Option:</span>
                <span className="font-bold text-slate-700">{selectedJob.plan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Posted Date:</span>
                <span className="font-bold text-slate-700">{selectedJob.postedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SLA Deadline:</span>
                <span className="font-bold text-slate-700">{selectedJob.slaDeadline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Caller:</span>
                <span className="font-bold text-slate-700">{selectedJob.caller}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Outbound Calls:</span>
                <span className="font-bold text-slate-700">{selectedJob.calls}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 bg-primary text-white rounded text-xs font-bold hover:bg-primary-container shadow"
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

export default SlaDashboard;
