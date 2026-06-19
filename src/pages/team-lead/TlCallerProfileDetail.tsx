import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface CallRecord {
  id: string;
  leadName: string;
  phone: string;
  tmid: string;
  time: string;
  duration: string;
  status: 'Connected' | 'Converted' | 'NR' | 'Busy';
}

interface AssignedLead {
  id: string;
  tmid: string;
  name: string;
  type: string;
  status: string;
  slaRemaining: string;
}

interface QcAudit {
  id: string;
  date: string;
  score: number;
  critic: string;
  notes: string;
  rubrics: {
    greeting: number;
    probing: number;
    objectionHandling: number;
    documentation: number;
  };
}

export const TlCallerProfileDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Resolve caller details from router navigation state, or fall back to default mock
  const state = location.state || {};
  const callerName = state.callerName || 'Rahul Sharma';
  const roleLabel = state.roleLabel || 'Senior Telecalling Associate';
  const status = state.status || 'On Call';
  const initialCalls = state.calls || 32;
  const initialRevenue = state.revenue || 2400;
  const initialQueueDepth = state.queueDepth || 28;
  const convRate = state.convRate || '6.3%';
  const tlMode = state.tlMode || 'dw';

  const [activeTab, setActiveTab] = useState<'overview' | 'calls' | 'queue' | 'qc' | 'attendance'>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reassignment overrides state
  const [callerQueueDepth, setCallerQueueDepth] = useState(initialQueueDepth);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [targetAgentForTransfer, setTargetAgentForTransfer] = useState('');
  const [transferReason, setTransferReason] = useState('');

  // Probation & training state
  const [probationWeek, setProbationWeek] = useState(4);
  const [assignedTraining, setAssignedTraining] = useState<string[]>([]);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState('Logistics 101');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mock Call History
  const callRecords: CallRecord[] = [
    { id: 'cr1', leadName: 'Suresh Yadav', phone: '+91 98765 43210', tmid: 'DR-48291', time: '12:39 PM', duration: '03:16', status: 'Connected' },
    { id: 'cr2', leadName: 'Balaji Roadlines', phone: '+91 88765 43212', tmid: 'TR-12093', time: '12:12 PM', duration: '05:42', status: 'Converted' },
    { id: 'cr3', leadName: 'Gati Agent Delhi', phone: '+91 94234 56792', tmid: 'TR-12097', time: '11:45 AM', duration: '01:05', status: 'NR' },
    { id: 'cr4', leadName: 'Devendra Pal', phone: '+91 98234 11223', tmid: 'DR-48296', time: '11:02 AM', duration: '02:30', status: 'Connected' },
    { id: 'cr5', leadName: 'Karan Johar', phone: '+91 99999 88888', tmid: 'DR-48295', time: '10:15 AM', duration: '00:45', status: 'Busy' }
  ];

  // Mock Live Queue
  const [assignedLeads, setAssignedLeads] = useState<AssignedLead[]>([
    { id: 'al1', tmid: 'DR-77890', name: 'Ramesh Yadav', type: 'Express Freight', status: 'No Response (2)', slaRemaining: '2h 15m' },
    { id: 'al2', tmid: 'DR-77981', name: 'Jagdish Singh', type: 'Market Load', status: 'In Funnel', slaRemaining: '14h 22m' },
    { id: 'al3', tmid: 'DR-78220', name: 'Amit Singh', type: 'Cold Chain', status: 'Callback Scheduled', slaRemaining: '0h 45m' }
  ]);

  // Mock QC Audits
  const qcAudits: QcAudit[] = [
    {
      id: 'aud1',
      date: '2 days ago',
      score: 8.7,
      critic: 'Ananya Iyer (QA)',
      notes: 'Strong call opening and professional tone. Fumbled slightly during the pricing objection but recovered well. Good documentation.',
      rubrics: { greeting: 9, probing: 8, objectionHandling: 8, documentation: 10 }
    },
    {
      id: 'aud2',
      date: '1 week ago',
      score: 8.2,
      critic: 'Rohan Sharma (QA)',
      notes: 'Tone was slightly rushed during peak shift hour. CRM notes are detailed but need to match exact truck type specifications.',
      rubrics: { greeting: 8, probing: 9, objectionHandling: 7, documentation: 9 }
    }
  ];

  // Handle transfer queue override
  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAgentForTransfer) {
      triggerToast('Please select a target caller agent.');
      return;
    }
    if (!transferReason.trim()) {
      triggerToast('Reason is required to execute a manual queue transfer.');
      return;
    }

    setCallerQueueDepth(0);
    setAssignedLeads([]);
    setShowTransferModal(false);
    setTransferReason('');
    triggerToast(`Transferred entire active queue to ${targetAgentForTransfer}. Audit logged ✓`);
  };

  // Probation extension
  const handleExtendProbation = () => {
    setProbationWeek(prev => prev + 1);
    triggerToast('Probation timeline extended by 1 week (Telecalling Head notified) ✓');
  };

  // Assign training courses
  const handleAssignTrainingConfirm = () => {
    if (assignedTraining.includes(selectedTraining)) {
      triggerToast(`${selectedTraining} is already assigned to this caller.`);
      return;
    }
    setAssignedTraining(prev => [...prev, selectedTraining]);
    setShowTrainingModal(false);
    triggerToast(`Assigned ${selectedTraining} training course successfully ✓`);
  };

  return (
    <main className="flex flex-col h-[calc(100vh-60px)] bg-gray-50 overflow-hidden relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#F39C12]"></span>
          {toastMessage}
        </div>
      )}

      {/* Profile Header Block */}
      <section className="bg-white border-b border-gray-200 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-1 hover:bg-gray-150 rounded-lg text-gray-500 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          
          <div className="w-14 h-14 bg-gradient-to-tr from-[#F39C12] to-amber-500 rounded-full flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
            {callerName.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-gray-800">{callerName}</h1>
              <span className="bg-amber-100 text-[#D35400] text-[9px] px-2 py-0.5 rounded font-extrabold uppercase">
                Probation: Week {probationWeek}/6
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-semibold mt-0.5">{roleLabel} · Status: <span className="text-green-600 font-bold">{status}</span></p>
          </div>
        </div>

        <div className="flex gap-4 text-xs font-semibold text-gray-500">
          <div>
            <span className="block text-[10px] text-gray-400 font-bold uppercase">Shift Hours Today</span>
            <span className="font-mono text-gray-700 text-sm">5h 12m / 8h 00m</span>
          </div>
        </div>
      </section>

      {/* Tabs navigation row */}
      <div className="bg-white border-b border-gray-200 px-6 flex gap-6 shrink-0 text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview & Target' },
          { id: 'calls', label: 'Call History log' },
          { id: 'queue', label: 'Live Queue list' },
          { id: 'qc', label: 'QC Feedback audits' },
          { id: 'attendance', label: 'Attendance heatmap' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3.5 border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-[#F39C12] text-gray-800' : 'border-transparent text-gray-400 hover:text-gray-650'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Workspace split layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Main tabs content space */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* KPIs summary cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Target Achievement</span>
                  <h3 className="text-xl font-extrabold text-gray-800 mt-1">{initialCalls}/45 calls</h3>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div className="bg-[#F39C12] h-full" style={{ width: `${(initialCalls/45)*100}%` }}></div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Conversion Rate</span>
                  <h3 className="text-xl font-extrabold text-[#D35400] mt-1">{convRate}</h3>
                  <span className="text-[9.5px] text-gray-400 block mt-1 font-semibold">SLA Benchmark: ≥5.0%</span>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Average Handle Time</span>
                  <h3 className="text-xl font-extrabold text-gray-800 mt-1">3m 42s</h3>
                  <span className="text-[9.5px] text-green-600 block mt-1 font-semibold">✓ 18s faster than baseline</span>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Revenue Contribution</span>
                  <h3 className="text-xl font-extrabold text-gray-800 mt-1">₹{initialRevenue}</h3>
                  <span className="text-[9.5px] text-gray-400 block mt-1 font-semibold">Shift agg conversions</span>
                </div>
              </div>

              {/* Performance charts mock */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide mb-4">Hourly Call Volumes</h4>
                
                <div className="flex items-end justify-between h-44 gap-2 pt-4">
                  {[
                    { label: '09 AM', count: 8 },
                    { label: '10 AM', count: 12 },
                    { label: '11 AM', count: 18 },
                    { label: '12 PM', count: 24 },
                    { label: '01 PM', count: 15 },
                    { label: '02 PM', count: 10 },
                    { label: '03 PM', count: 19 },
                    { label: '04 PM', count: 22 }
                  ].map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center group relative">
                      <span className="text-[9.5px] font-mono text-gray-400 mb-1 group-hover:text-[#D35400] font-bold">
                        {item.count}
                      </span>
                      <div 
                        className="w-full bg-orange-100 hover:bg-[#F39C12] rounded-t transition-colors" 
                        style={{ height: `${(item.count/30)*100}px` }}
                      ></div>
                      <span className="text-[9.5px] font-semibold text-gray-400 mt-1">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calls' && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-xs">
              <div className="p-3 bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-700 uppercase tracking-wider">
                Shift Call Logs Detail
              </div>

              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold uppercase text-[9px] border-b border-gray-150">
                    <th className="p-3 pl-4">Time</th>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">TMID</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3 text-center">Duration</th>
                    <th className="p-3 text-right pr-4">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                  {callRecords.map(rec => (
                    <tr key={rec.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="p-3 pl-4 font-mono text-gray-400">{rec.time}</td>
                      <td className="p-3 font-bold text-gray-850">{rec.leadName}</td>
                      <td className="p-3 font-mono text-gray-500">{rec.tmid}</td>
                      <td className="p-3 font-mono text-gray-500">{rec.phone}</td>
                      <td className="p-3 text-center font-mono">{rec.duration}</td>
                      <td className="p-3 text-right pr-4">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                          rec.status === 'Converted' ? 'bg-green-50 text-green-700 border-green-200' :
                          rec.status === 'Connected' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          rec.status === 'NR' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-gray-100 text-gray-650'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'queue' && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-xs">
              <div className="p-3 bg-gray-50 border-b border-gray-200 font-bold text-gray-700 uppercase tracking-wider flex justify-between items-center">
                <span>Currently Assigned Lead Queue ({callerQueueDepth} leads)</span>
                {callerQueueDepth > 0 && (
                  <button 
                    onClick={() => setShowTransferModal(true)}
                    className="bg-[#F39C12] hover:bg-[#e08e0b] text-white px-2 py-0.8 rounded font-bold text-[10px] shadow"
                  >
                    Transfer All leads
                  </button>
                )}
              </div>

              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 font-bold uppercase text-[9px] border-b border-gray-150">
                    <th className="p-3 pl-4">Lead TMID</th>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Category/Type</th>
                    <th className="p-3">SLA Remaining</th>
                    <th className="p-3 text-right pr-4">Operational action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                  {assignedLeads.map(lead => (
                    <tr key={lead.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="p-3 pl-4 font-mono text-gray-500">{lead.tmid}</td>
                      <td className="p-3 font-bold text-gray-800">{lead.name}</td>
                      <td className="p-3 text-gray-450">{lead.type}</td>
                      <td className="p-3 font-mono text-red-500 font-bold">{lead.slaRemaining}</td>
                      <td className="p-3 text-right pr-4">
                        <button 
                          onClick={() => {
                            setAssignedLeads((prev: AssignedLead[]) => prev.filter(l => l.id !== lead.id));
                            setCallerQueueDepth((prev: number) => prev - 1);
                            triggerToast(`Lead ${lead.tmid} reassigned out of ${callerName}'s queue ✓`);
                          }}
                          className="text-[#F39C12] hover:underline font-bold text-[10px]"
                        >
                          Reassign Lead
                        </button>
                      </td>
                    </tr>
                  ))}
                  {assignedLeads.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-400 italic">No active leads in queue.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'qc' && (
            <div className="space-y-4 text-xs">
              {qcAudits.map(audit => (
                <div key={audit.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <div>
                      <span className="font-bold text-gray-800 text-xs">Audit Score: <span className="text-[#D35400] font-extrabold">{audit.score}/10</span></span>
                      <span className="text-gray-400 block text-[9.5px] font-semibold mt-0.5">Audited by: {audit.critic} · {audit.date}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center select-none font-semibold">
                    <div className="bg-gray-50 p-2 border border-gray-150 rounded">
                      <span className="text-gray-400 block text-[9px] uppercase">Greeting</span>
                      <span className="text-xs text-gray-800 font-bold">{audit.rubrics.greeting}/10</span>
                    </div>
                    <div className="bg-gray-50 p-2 border border-gray-150 rounded">
                      <span className="text-gray-400 block text-[9px] uppercase">Probing</span>
                      <span className="text-xs text-gray-800 font-bold">{audit.rubrics.probing}/10</span>
                    </div>
                    <div className="bg-gray-50 p-2 border border-gray-150 rounded">
                      <span className="text-gray-400 block text-[9px] uppercase">Objection Handle</span>
                      <span className="text-xs text-gray-800 font-bold">{audit.rubrics.objectionHandling}/10</span>
                    </div>
                    <div className="bg-gray-50 p-2 border border-gray-150 rounded">
                      <span className="text-gray-400 block text-[9px] uppercase">Notes/CRM</span>
                      <span className="text-xs text-gray-800 font-bold">{audit.rubrics.documentation}/10</span>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-normal italic bg-gray-50/50 p-2.5 rounded border border-gray-100">
                    "{audit.notes}"
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-xs space-y-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold text-gray-850">Shift Attendance Heatmap</span>
                <div className="flex gap-4 select-none font-bold text-gray-400 text-[10px]">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-green-500 rounded-sm"></span> On-Time
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-amber-400 rounded-sm"></span> Late Login
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-red-500 rounded-sm"></span> Absent
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { day: 1, status: 'ontime' },
                  { day: 2, status: 'ontime' },
                  { day: 3, status: 'late' },
                  { day: 4, status: 'ontime' },
                  { day: 5, status: 'ontime' },
                  { day: 6, status: 'weekend' },
                  { day: 7, status: 'weekend' },
                  { day: 8, status: 'ontime' },
                  { day: 9, status: 'ontime' },
                  { day: 10, status: 'absent' },
                  { day: 11, status: 'ontime' },
                  { day: 12, status: 'late' },
                  { day: 13, status: 'weekend' },
                  { day: 14, status: 'weekend' },
                  { day: 15, status: 'ontime' },
                  { day: 16, status: 'ontime' },
                  { day: 17, status: 'ontime' },
                  { day: 18, status: 'ontime' },
                  { day: 19, status: 'ontime' },
                  { day: 20, status: 'weekend' },
                  { day: 21, status: 'weekend' }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold font-mono text-white ${
                      item.status === 'ontime' ? 'bg-green-500' :
                      item.status === 'late' ? 'bg-amber-400' :
                      item.status === 'absent' ? 'bg-red-500 animate-pulse' :
                      'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {item.day}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Action Sidebar Panel */}
        <aside className="w-72 border-l border-gray-200 p-6 bg-white flex flex-col justify-between shrink-0 overflow-y-auto text-xs">
          <div className="space-y-4">
            <h3 className="font-extrabold text-gray-800 uppercase tracking-wide border-b border-gray-150 pb-2">
              Supervisor Actions
            </h3>

            <div className="space-y-2">
              <button 
                onClick={() => setShowTransferModal(true)}
                className="w-full flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-orange-50 hover:border-[#F39C12] transition-all text-left"
              >
                <span className="material-symbols-outlined text-[#F39C12]">move_down</span>
                <div>
                  <p className="font-bold text-gray-850">Transfer Queue</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Reassign all active leads</p>
                </div>
              </button>

              <button 
                onClick={handleExtendProbation}
                className="w-full flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-orange-50 hover:border-[#F39C12] transition-all text-left"
              >
                <span className="material-symbols-outlined text-[#F39C12]">update</span>
                <div>
                  <p className="font-bold text-gray-850">Extend Probation</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Extend target timeline by 1 wk</p>
                </div>
              </button>

              <button 
                onClick={() => setShowTrainingModal(true)}
                className="w-full flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-orange-50 hover:border-[#F39C12] transition-all text-left"
              >
                <span className="material-symbols-outlined text-[#F39C12]">school</span>
                <div>
                  <p className="font-bold text-gray-850">Assign Training</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Assign soft skills courses</p>
                </div>
              </button>
            </div>

            {/* Assigned training log */}
            {assignedTraining.length > 0 && (
              <div className="bg-orange-50/40 border border-orange-100 rounded-xl p-3 space-y-1.5">
                <span className="text-[9.5px] font-bold text-orange-700 uppercase">Assigned Training courses:</span>
                <ul className="list-disc pl-4 text-[10px] text-gray-600 font-semibold space-y-0.5">
                  {assignedTraining.map(t => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-150 space-y-2">
            <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl">
              <div className="flex justify-between items-center font-bold">
                <span className="text-[10px] text-orange-700 uppercase">Audits Target Score</span>
                <span className="text-[#D35400]">8.5/10</span>
              </div>
              <p className="text-[10px] text-gray-450 mt-1 leading-normal">Rubric includes tone, compliance, call opening greeting, and data entry tags accuracy.</p>
            </div>
          </div>
        </aside>
      </div>

      {/* TRANSFER QUEUE MODAL (frictionful audit remark required) */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-gray-100 text-xs">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-orange-600">move_down</span>
              Bulk Queue Transfer
            </h3>

            <form onSubmit={handleConfirmTransfer} className="space-y-4">
              <div>
                <label className="text-gray-500 block mb-1 font-semibold">Select Destination Caller</label>
                <select 
                  value={targetAgentForTransfer}
                  onChange={(e) => setTargetAgentForTransfer(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded px-2.5 py-1.5 bg-white outline-none font-semibold text-gray-800"
                >
                  <option value="">Select Caller Agent...</option>
                  {tlMode === 'dw' ? (
                    <>
                      <option value="Rahul S.">Rahul S.</option>
                      <option value="Sonia R.">Sonia R.</option>
                      <option value="Aman K.">Aman K.</option>
                      <option value="Priya P.">Priya P.</option>
                    </>
                  ) : (
                    <>
                      <option value="Alex R.">Alex R.</option>
                      <option value="Sarah C.">Sarah C.</option>
                      <option value="Marcus T.">Marcus T.</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-gray-500 block mb-1 font-semibold">Transfer Reason Remark</label>
                <textarea 
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  required
                  placeholder="Justify why this bulk queue reassignment is required..."
                  rows={3}
                  className="w-full border border-gray-200 rounded px-2.5 py-1.5 outline-none font-medium text-gray-800 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 rounded font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#F39C12] hover:bg-[#e08e0b] text-white rounded font-bold shadow-sm"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN TRAINING MODAL */}
      {showTrainingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-gray-100 text-xs">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-orange-600">school</span>
              Assign Training Course
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-gray-500 block mb-1 font-semibold">Select Course</label>
                <select 
                  value={selectedTraining}
                  onChange={(e) => setSelectedTraining(e.target.value)}
                  className="w-full border border-gray-200 rounded px-2.5 py-1.5 bg-white outline-none font-semibold text-gray-800"
                >
                  <option value="Logistics 101">Logistics 101 - Hub routing</option>
                  <option value="Soft Skills Communication">Soft Skills Communication</option>
                  <option value="Objection Handling & pricing">Objection Handling & Pricing negotiation</option>
                  <option value="CRM Note taking best practices">CRM Note taking compliance</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  onClick={() => setShowTrainingModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 rounded font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAssignTrainingConfirm}
                  className="px-4 py-2 bg-[#F39C12] hover:bg-[#e08e0b] text-white rounded font-bold shadow-sm"
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default TlCallerProfileDetail;
