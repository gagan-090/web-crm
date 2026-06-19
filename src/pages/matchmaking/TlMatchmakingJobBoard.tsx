import React, { useState } from 'react';

interface JobCard {
  id: string;
  tmid: string;
  source: string;
  destination: string;
  tier: 'SUPER PREMIUM' | 'PREMIUM' | 'STANDARD';
  status: 'Open' | 'In Progress' | 'SLA Risk' | 'Filled' | 'Expired';
  slaHoursLeft: number;
  slaPercent: number; // 0 to 100
  assignedAgent: string;
  candidatesCount: number;
}

interface Candidate {
  id: string;
  name: string;
  matchScore: number;
  phone: string;
  truckType: string;
  experience: string;
}

export const TlMatchmakingJobBoard: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Slide-out drawer details
  const [selectedJob, setSelectedJob] = useState<JobCard | null>(null);

  // Assign specialist modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignJobId, setAssignJobId] = useState<string | null>(null);
  const [targetAgent, setTargetAgent] = useState('');
  const [assignReason, setAssignReason] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mock Job board dataset
  const [jobs, setJobs] = useState<JobCard[]>([
    { id: 'j1', tmid: 'JB-98231', source: 'Mumbai Central', destination: 'Bangalore ICD', tier: 'SUPER PREMIUM', status: 'Open', slaHoursLeft: 4, slaPercent: 75, assignedAgent: 'Unassigned', candidatesCount: 4 },
    { id: 'j2', tmid: 'JB-98232', source: 'Delhi NRT', destination: 'Ahmedabad Hub', tier: 'PREMIUM', status: 'Open', slaHoursLeft: 6, slaPercent: 50, assignedAgent: 'Unassigned', candidatesCount: 3 },
    { id: 'j3', tmid: 'JB-77210', source: 'Pune Cluster', destination: 'Chennai Port', tier: 'SUPER PREMIUM', status: 'SLA Risk', slaHoursLeft: 0.3, slaPercent: 95, assignedAgent: 'Rohit K.', candidatesCount: 5 },
    { id: 'j4', tmid: 'JB-77215', source: 'Hyderabad', destination: 'Vizag Terminal', tier: 'PREMIUM', status: 'SLA Risk', slaHoursLeft: 0.8, slaPercent: 90, assignedAgent: 'Sneha M.', candidatesCount: 2 },
    { id: 'j5', tmid: 'JB-99001', source: 'Kolkata', destination: 'Guwahati Hub', tier: 'STANDARD', status: 'In Progress', slaHoursLeft: 12, slaPercent: 25, assignedAgent: 'Javed K.', candidatesCount: 4 },
    { id: 'j6', tmid: 'JB-97100', source: 'Surat', destination: 'Jaipur South', tier: 'SUPER PREMIUM', status: 'Filled', slaHoursLeft: 0, slaPercent: 0, assignedAgent: 'Deepak G.', candidatesCount: 1 },
    { id: 'j7', tmid: 'JB-96001', source: 'Lucknow', destination: 'Patna ICD', tier: 'STANDARD', status: 'Expired', slaHoursLeft: 0, slaPercent: 100, assignedAgent: 'Unassigned', candidatesCount: 0 }
  ]);

  // Mock candidates database for drawer
  const candidatesDb: Record<string, Candidate[]> = {
    'j1': [
      { id: 'c1', name: 'Ramesh Yadav', matchScore: 94, phone: '+91 98765 43210', truckType: '14 Wheeler Taurus', experience: '6 yrs' },
      { id: 'c2', name: 'Amit Singh', matchScore: 88, phone: '+91 88765 43211', truckType: '12 Wheeler Taurus', experience: '4 yrs' },
      { id: 'c3', name: 'Devendra Pal', matchScore: 82, phone: '+91 98234 11223', truckType: '10 Wheeler', experience: '5 yrs' }
    ],
    'j2': [
      { id: 'c4', name: 'Vikram Rathore', matchScore: 91, phone: '+91 68765 43213', truckType: 'Container 32ft MX', experience: '8 yrs' },
      { id: 'c5', name: 'Harpreet Singh', matchScore: 85, phone: '+91 91112 23344', truckType: 'Container 24ft', experience: '3 yrs' }
    ],
    'j3': [
      { id: 'c6', name: 'Gurpreet Singh', matchScore: 96, phone: '+91 92222 33333', truckType: '18 Wheeler Trailer', experience: '10 yrs' },
      { id: 'c7', name: 'Satish Kumar', matchScore: 90, phone: '+91 94444 55555', truckType: '14 Wheeler Taurus', experience: '7 yrs' }
    ]
  };

  // Open assignment modal
  const handleOpenAssign = (jobId: string) => {
    setAssignJobId(jobId);
    setTargetAgent('');
    setAssignReason('');
    setShowAssignModal(true);
  };

  // Confirm assignment override
  const handleConfirmAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAgent) {
      triggerToast('Please select a matchmaking specialist.');
      return;
    }
    if (!assignReason.trim()) {
      triggerToast('Reason is required to execute a manual job override.');
      return;
    }

    setJobs(prev => prev.map(job => {
      if (job.id === assignJobId) {
        return { 
          ...job, 
          assignedAgent: targetAgent, 
          status: job.status === 'Open' ? 'In Progress' : job.status 
        };
      }
      return job;
    }));

    setShowAssignModal(false);
    triggerToast(`Assigned job to ${targetAgent} successfully. Handover audit logged ✓`);
  };

  // Trigger manual sync
  const handleSyncBoard = () => {
    triggerToast('Matchmaking jobs synced with main freight pipeline board ✓');
  };

  const getColJobs = (status: JobCard['status']) => jobs.filter(j => j.status === status);

  const getSlaRiskCount = () => jobs.filter(j => j.status === 'SLA Risk').length;

  return (
    <main className="flex flex-col h-[calc(100vh-60px)] bg-white overflow-hidden relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#F39C12]"></span>
          {toastMessage}
        </div>
      )}

      {/* Critical SLA Alarm Strip */}
      {getSlaRiskCount() > 0 && (
        <div className="bg-red-50 border-b border-red-200 text-red-700 px-4 py-2.5 flex justify-between items-center shrink-0 text-xs font-bold">
          <div className="flex items-center gap-1.5 animate-pulse">
            <span className="material-symbols-outlined text-red-600 text-[18px]">warning</span>
            <span>CRITICAL: {getSlaRiskCount()} Matchmaking Jobs at SLA Risk (&lt; 1h remaining). Reassign to specialists!</span>
          </div>
          <span className="underline text-[10.5px]">View Risk Board</span>
        </div>
      )}

      {/* Header controls strip */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide">TL Matchmaking Job Board</h1>
          <p className="text-[10px] text-gray-400">Monitor driver-shipper matchmaking queues, SLA risk status, and candidate fit</p>
        </div>

        <button 
          onClick={handleSyncBoard}
          className="bg-white border border-gray-200 hover:border-[#F39C12] text-gray-700 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          <span>Sync Board</span>
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 flex overflow-x-auto p-4 gap-4 bg-gray-50/50">
        
        {/* Kanban Columns */}
        {([
          { title: 'Open / Unassigned', status: 'Open', color: 'border-t-blue-500 bg-blue-50/15' },
          { title: 'In Progress', status: 'In Progress', color: 'border-t-orange-500 bg-orange-50/10' },
          { title: 'SLA Risk', status: 'SLA Risk', color: 'border-t-red-500 bg-red-50/10 ring-1 ring-red-200' },
          { title: 'Filled', status: 'Filled', color: 'border-t-green-500 bg-green-50/10' },
          { title: 'Expired / Missed', status: 'Expired', color: 'border-t-gray-400 bg-gray-150/10' }
        ] as const).map(col => {
          const colJobs = getColJobs(col.status);
          return (
            <div 
              key={col.status} 
              className={`w-72 rounded-xl border border-gray-250 border-t-4 flex flex-col h-full shrink-0 shadow-sm ${col.color}`}
            >
              <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-xl select-none">
                <span className="text-[10px] font-extrabold text-gray-700 uppercase tracking-wider">{col.title}</span>
                <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.2 rounded-full">
                  {colJobs.length}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                {colJobs.map(job => {
                  const isRisk = job.status === 'SLA Risk';
                  return (
                    <div 
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative ${
                        isRisk ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1.5 text-[9px] font-extrabold">
                        <span className="text-gray-400 font-mono">{job.tmid}</span>
                        <span className={`px-1.5 py-0.2 rounded ${
                          job.tier === 'SUPER PREMIUM' ? 'bg-purple-100 text-purple-700' :
                          job.tier === 'PREMIUM' ? 'bg-amber-100 text-[#D35400]' :
                          'bg-gray-150 text-gray-600'
                        }`}>
                          {job.tier}
                        </span>
                      </div>

                      <p className="font-bold text-gray-800 text-xs leading-snug">
                        {job.source} ➔ {job.destination}
                      </p>

                      <div className="mt-3 flex justify-between items-center text-[10px]">
                        <div className="flex items-center gap-1 text-gray-450 font-semibold">
                          <span className="material-symbols-outlined text-[13px]">timer</span>
                          <span>
                            {isRisk ? `SLA: ${job.slaHoursLeft*60}m Left` : `SLA: ${job.slaHoursLeft}h`}
                          </span>
                        </div>

                        {job.assignedAgent === 'Unassigned' ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleOpenAssign(job.id); }}
                            className="bg-orange-50 border border-[#F39C12] text-[#D35400] px-2 py-0.5 rounded text-[9.5px] font-extrabold hover:bg-[#F39C12] hover:text-white transition-colors"
                          >
                            Assign Specialist
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-400 font-bold bg-gray-50 border border-gray-150 px-1.5 py-0.2 rounded">
                            {job.assignedAgent}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* JOB DETAIL SLIDE-OUT PANEL */}
      {selectedJob && (
        <div className="absolute inset-y-0 right-0 w-80 bg-white border-l border-gray-250 shadow-2xl z-40 flex flex-col justify-between text-xs animate-in slide-in-from-right duration-250">
          <div>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-extrabold text-gray-800 uppercase tracking-wide text-xs">Job Board Detail</h3>
                <span className="text-[10px] text-gray-400 font-mono">{selectedJob.tmid}</span>
              </div>
              <button 
                onClick={() => setSelectedJob(null)}
                className="text-gray-400 hover:text-gray-650 font-bold px-1 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Route Pipeline:</span>
                <p className="font-bold text-gray-800 text-xs">{selectedJob.source} ➔ {selectedJob.destination}</p>
                <div className="flex gap-2">
                  <span className="bg-amber-100 text-[#D35400] text-[9.5px] px-2 py-0.5 rounded font-extrabold uppercase">
                    {selectedJob.tier}
                  </span>
                  <span className="bg-gray-100 text-gray-500 text-[9.5px] px-2 py-0.5 rounded font-extrabold uppercase">
                    SLA Remaining: {selectedJob.slaHoursLeft}h
                  </span>
                </div>
              </div>

              {/* Candidate Shortlist */}
              <div className="space-y-2 pt-2 border-t border-gray-150">
                <h4 className="text-[10.5px] font-bold text-gray-800 uppercase tracking-wider">Candidate Match shortlist ({selectedJob.candidatesCount})</h4>
                
                <div className="space-y-2">
                  {(candidatesDb[selectedJob.id] || []).map(cand => (
                    <div key={cand.id} className="p-2.5 bg-gray-50 border border-gray-150 rounded-xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-850">{cand.name}</span>
                        <span className="bg-green-100 text-green-700 text-[9.5px] px-1.5 py-0.2 rounded font-extrabold">
                          {cand.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-450 font-semibold">{cand.truckType} · Experience: {cand.experience}</p>
                      <div className="pt-1 flex justify-between items-center">
                        <span className="font-mono text-gray-400">{cand.phone}</span>
                        <button 
                          onClick={() => triggerToast(`Contacting candidate ${cand.name} on behalf of assigned caller...`)}
                          className="bg-white border border-gray-200 text-gray-600 px-1.5 py-0.2 rounded hover:bg-[#F39C12] hover:text-white hover:border-[#F39C12] transition-colors text-[9.5px] font-bold"
                        >
                          Ping Driver
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!candidatesDb[selectedJob.id] || candidatesDb[selectedJob.id].length === 0) && (
                    <div className="text-[10px] text-gray-400 italic py-4 text-center">No shortlists generated yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2">
            <button 
              onClick={() => handleOpenAssign(selectedJob.id)}
              className="flex-1 bg-[#F39C12] hover:bg-[#e08e0b] text-white py-2 rounded-lg font-bold text-xs shadow"
            >
              Reassign Specialist
            </button>
            <button 
              onClick={() => setSelectedJob(null)}
              className="flex-1 bg-white border border-gray-200 text-gray-500 py-2 rounded-lg font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ASSIGN SPECIALIST OVERRIDE MODAL */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-gray-100 text-xs">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-orange-600">manage_accounts</span>
              Assign Matchmaker Override
            </h3>

            <form onSubmit={handleConfirmAssign} className="space-y-4">
              <div>
                <label className="text-gray-500 block mb-1 font-semibold">Select Matchmaking Specialist</label>
                <select 
                  value={targetAgent}
                  onChange={(e) => setTargetAgent(e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded px-2.5 py-1.5 bg-white outline-none font-semibold text-gray-800"
                >
                  <option value="">Select Agent...</option>
                  <option value="Rohit K.">Rohit K.</option>
                  <option value="Sneha M.">Sneha M.</option>
                  <option value="Javed K.">Javed K.</option>
                  <option value="Deepak G.">Deepak G.</option>
                </select>
              </div>

              <div>
                <label className="text-gray-500 block mb-1 font-semibold">Operational Reason</label>
                <textarea 
                  value={assignReason}
                  onChange={(e) => setAssignReason(e.target.value)}
                  required
                  placeholder="Justify this manual assignment override (required)..."
                  rows={3}
                  className="w-full border border-gray-200 rounded px-2.5 py-1.5 outline-none font-medium text-gray-800 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 border border-gray-250 text-gray-500 rounded font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#F39C12] hover:bg-[#e08e0b] text-white rounded font-bold shadow-sm"
                >
                  Assign specialist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
};

export default TlMatchmakingJobBoard;
