import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMmJobsQuery, useGetMmJobApplicantsQuery, useGetMmJobCallLogsQuery } from '../../services/api/webCrmApi';
import { useClickToCall } from '../../shared/hooks/useClickToCall';

interface JobCard {
  id: string;
  transporter: string;
  transporterId?: number;
  transporterTmid?: string;
  phone?: string;
  source: string;
  destination: string;
  tier: 'SUPER PREMIUM' | 'PREMIUM' | 'STANDARD';
  status: 'Open' | 'In Progress' | 'SLA Risk' | 'Filled' | 'Expired';
  slaDaysLeft: number;
  totalSlaDays: number;
  postedText: string;
  driversContacted: number;
  truckType: string;
  license: string;
  experience: string;
  duration: string;
  startDate: string;
}

interface ShortlistedDriver {
  id?: number;
  phone?: string;
  name: string;
  tmid: string;
  tier: string;
  location: string;
  matchPercent: number;
  lastStatus: string;
}

export const MmJobBoard: React.FC = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sorting & Filtering state
  const [sortOption, setSortOption] = useState<'urgency' | 'date' | 'tier'>('urgency');
  const [filterOption, setFilterOption] = useState<'all' | 'premium' | 'super' | 'unassigned'>('all');

  // Selected job for slide-out detail panel
  const [selectedJob, setSelectedJob] = useState<JobCard | null>(null);

  const { triggerCall } = useClickToCall();
  const { data: realJobsData } = useGetMmJobsQuery();
  const { data: applicantsData } = useGetMmJobApplicantsQuery(selectedJob?.id || '', { skip: !selectedJob });
  const { data: callLogsData } = useGetMmJobCallLogsQuery(selectedJob?.id || '', { skip: !selectedJob });
  const [jobs, setJobs] = useState<JobCard[]>([]);

  useEffect(() => {
    if (realJobsData?.jobs && realJobsData.jobs.length > 0) {
      const mappedJobs: JobCard[] = realJobsData.jobs.map((job: any) => {
        const parts = job.route ? job.route.split('➔') : [];
        return {
          id: job.jobId || `JD-${job.id}`,
          transporter: job.transporter,
          transporterId: job.transporterId,
          transporterTmid: job.transporterTmid,
          phone: job.phone,
          source: parts[0]?.trim() || 'Delhi',
          destination: parts[1]?.trim() || 'Mumbai',
          tier: job.tier === 'SUPER PREMIUM' ? 'SUPER PREMIUM' : job.tier === 'STANDARD' ? 'STANDARD' : 'PREMIUM',
          status: job.status === 'Open' ? 'Open' : (job.status === 'Filled' ? 'Filled' : 'In Progress'),
          slaDaysLeft: job.daysOpen > 7 ? 0 : 7 - job.daysOpen,
          totalSlaDays: job.tier === 'SUPER PREMIUM' ? 7 : 10,
          postedText: `${job.daysOpen} day${job.daysOpen === 1 ? '' : 's'} ago`,
          driversContacted: 0,
          truckType: job.truckType,
          license: job.license,
          experience: job.experience,
          duration: '3 months',
          startDate: '01 Jul 2026'
        };
      });
      setJobs(mappedJobs);
    } else {
      setJobs([
        { id: 'JD-12034', transporter: 'Sharma Logistics', source: 'Delhi', destination: 'Mumbai', tier: 'SUPER PREMIUM', status: 'SLA Risk', slaDaysLeft: 1, totalSlaDays: 7, postedText: '3 days ago', driversContacted: 6, truckType: 'Heavy Truck', license: 'HMV', experience: '5+ years', duration: '3 months', startDate: '01 Jul 2026' },
        { id: 'JD-12041', transporter: 'Anand Transport', source: 'Jaipur', destination: 'Pune', tier: 'PREMIUM', status: 'SLA Risk', slaDaysLeft: 2, totalSlaDays: 10, postedText: '8 days ago', driversContacted: 4, truckType: 'Medium Truck', license: 'HMV', experience: '3+ years', duration: '6 months', startDate: '05 Jul 2026' },
        { id: 'JD-12045', transporter: 'VRL Express', source: 'Ahmedabad', destination: 'Chennai', tier: 'SUPER PREMIUM', status: 'In Progress', slaDaysLeft: 5, totalSlaDays: 7, postedText: '2 days ago', driversContacted: 3, truckType: 'Container 24ft', license: 'MCV', experience: '4+ years', duration: '1 month', startDate: '10 Jul 2026' },
        { id: 'JD-12050', transporter: 'LogiForce Systems', source: 'Kolkata', destination: 'Patna', tier: 'PREMIUM', status: 'Open', slaDaysLeft: 9, totalSlaDays: 10, postedText: '1 day ago', driversContacted: 1, truckType: 'Light Commercial', license: 'LMV', experience: '2+ years', duration: '2 weeks', startDate: '12 Jul 2026' },
        { id: 'JD-12055', transporter: 'SwiftLine Shippers', source: 'Delhi', destination: 'Bangalore', tier: 'PREMIUM', status: 'Open', slaDaysLeft: 7, totalSlaDays: 10, postedText: '3 hours ago', driversContacted: 0, truckType: 'Container 32ft', license: 'HMV', experience: '5+ years', duration: '3 months', startDate: '15 Jul 2026' },
        { id: 'JD-12099', transporter: 'Agrawal Global', source: 'Surat', destination: 'Jaipur', tier: 'PREMIUM', status: 'Filled', slaDaysLeft: 0, totalSlaDays: 10, postedText: '10 days ago', driversContacted: 8, truckType: 'Taurus 14W', license: 'HMV', experience: '6+ years', duration: '12 months', startDate: '20 Jun 2026' }
      ]);
    }
  }, [realJobsData]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch candidates database for slide-out
  const candidates: ShortlistedDriver[] = applicantsData?.applicants && applicantsData.applicants.length > 0 
    ? applicantsData.applicants.map((cand: any) => ({
        id: cand.id,
        name: cand.name,
        phone: cand.phone,
        tmid: cand.tmid,
        tier: 'Verified',
        location: cand.city && cand.state ? `${cand.city}, ${cand.state}` : 'Delhi Hub',
        matchPercent: cand.matchPercent || 90,
        lastStatus: cand.lastStatus
      }))
    : [
        { id: 48291, name: 'Suresh Yadav', phone: '9876543210', tmid: 'DR-48291', tier: 'Verified', location: 'Delhi Hub', matchPercent: 92, lastStatus: 'Interested' },
        { id: 48292, name: 'Amit Singh', phone: '8876543211', tmid: 'DR-48292', tier: 'Trusted', location: 'Jaipur Hub', matchPercent: 88, lastStatus: 'Callback Scheduled' },
        { id: 48293, name: 'Ramesh Kumar', phone: '7876543212', tmid: 'DR-48293', tier: 'Verified', location: 'Mumbai Central', matchPercent: 82, lastStatus: 'NR' },
        { id: 48296, name: 'Devendra Pal', phone: '9823411223', tmid: 'DR-48296', tier: 'Verified', location: 'Ahmedabad North', matchPercent: 75, lastStatus: 'No Call Yet' }
      ];

  // Call logs list for the detail panel
  const callLogs = callLogsData?.logs && callLogsData.logs.length > 0
    ? callLogsData.logs
    : [
        { date: 'Today, 11:30 AM', driver: 'Suresh Yadav', outcome: 'Connected / Interested', caller: 'Self' },
        { date: 'Yesterday, 04:15 PM', driver: 'Ramesh Kumar', outcome: 'No Response', caller: 'Self' }
      ];

  // Actions
  const handleTakeJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'In Progress' } : job
    ));
    triggerToast(`Job ${jobId} assigned to you and moved to In Progress ✓`);
  };

  const handleDialTransporter = (name: string, phone: string, jobId: string) => {
    triggerToast(`Calling transporter: ${name} (${phone})...`);
    triggerCall(name, phone, 'Transporter Matchmaking', selectedJob?.transporterTmid || 'TR-1000', undefined, {
      jobId: jobId,
      jobRoute: `${selectedJob?.source} ➔ ${selectedJob?.destination}`,
      jobTransporter: selectedJob?.transporter,
      jobTier: selectedJob?.tier
    });
  };

  const handleDialDriver = (name: string, phone: string, tmid: string, jobId: string) => {
    triggerToast(`Calling driver: ${name} (${phone})...`);
    triggerCall(name, phone, 'Driver Matchmaking', tmid, undefined, {
      driverName: name,
      driverTmid: tmid,
      jobId: jobId,
      jobRoute: `${selectedJob?.source} ➔ ${selectedJob?.destination}`,
      jobTransporter: selectedJob?.transporter,
      jobTier: selectedJob?.tier
    });
  };

  // Filter & Sort Logic
  const filteredJobs = jobs.filter(job => {
    if (filterOption === 'premium') return job.tier === 'PREMIUM';
    if (filterOption === 'super') return job.tier === 'SUPER PREMIUM';
    if (filterOption === 'unassigned') return job.status === 'Open';
    return true;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortOption === 'urgency') return a.slaDaysLeft - b.slaDaysLeft;
    if (sortOption === 'date') return a.postedText.includes('hours') ? -1 : 1;
    if (sortOption === 'tier') return a.tier === 'SUPER PREMIUM' ? -1 : 1;
    return 0;
  });

  const getColJobs = (status: JobCard['status']) => sortedJobs.filter(j => j.status === status);

  const getColCount = (status: JobCard['status']) => jobs.filter(j => j.status === status).length;

  return (
    <main className="flex flex-col h-[calc(100vh-60px)] bg-white overflow-hidden relative text-xs">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#8E44AD]"></span>
          {toastMessage}
        </div>
      )}

      {/* Filter and Sort bar */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide">Matchmaking Job Board</h1>
            <p className="text-[10px] text-gray-400">Manage client shipments, shortlists, and EOD EOD compliance</p>
          </div>

          <div className="flex gap-2">
            {/* Filter pills */}
            {(['all', 'premium', 'super', 'unassigned'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterOption(f)}
                className={`px-3 py-1 rounded-full font-bold border transition-colors ${
                  filterOption === f 
                    ? 'bg-[#8E44AD] text-white border-[#8E44AD]' 
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-55'
                }`}
              >
                {f === 'all' && 'All Jobs'}
                {f === 'premium' && 'Premium only'}
                {f === 'super' && 'Super Premium'}
                {f === 'unassigned' && 'Unassigned'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-450 font-bold uppercase text-[10px]">Sort by:</span>
          <select
            value={sortOption}
            onChange={(e: any) => setSortOption(e.target.value)}
            className="border border-gray-200 rounded-lg px-2 py-1 bg-white outline-none font-semibold text-gray-700"
          >
            <option value="urgency">SLA Urgency</option>
            <option value="date">Date Posted</option>
            <option value="tier">Plan Tier</option>
          </select>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 flex overflow-x-auto p-4 gap-4 bg-gray-50/50">
        
        {/* Columns list */}
        {([
          { title: 'Open', status: 'Open', color: 'border-t-blue-500 bg-blue-50/15' },
          { title: 'In Progress', status: 'In Progress', color: 'border-t-orange-500 bg-orange-50/10' },
          { title: 'SLA Risk', status: 'SLA Risk', color: 'border-t-red-500 bg-red-50/10' },
          { title: 'Filled', status: 'Filled', color: 'border-t-green-500 bg-green-50/10' },
          { title: 'Expired', status: 'Expired', color: 'border-t-gray-400 bg-gray-150/10' }
        ] as const).map(col => {
          const colJobs = getColJobs(col.status);
          const totalCount = getColCount(col.status);
          const isRisk = col.status === 'SLA Risk' && totalCount > 0;

          return (
            <div 
              key={col.status}
              className={`w-72 rounded-xl border border-gray-250 border-t-4 flex flex-col h-full shrink-0 shadow-sm ${col.color}`}
            >
              {/* Header */}
              <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-white rounded-t-xl select-none">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                  isRisk ? 'text-red-650 animate-pulse font-black' : 'text-gray-700'
                }`}>
                  {col.title}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                  isRisk ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {totalCount}
                </span>
              </div>

              {/* Cards List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                {colJobs.map(job => {
                  const ratio = job.slaDaysLeft / job.totalSlaDays;
                  let slaColor = 'bg-green-500';
                  if (ratio <= 0.2) slaColor = 'bg-red-500';
                  else if (ratio <= 0.5) slaColor = 'bg-amber-500';

                  return (
                    <div 
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className={`bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative ${
                        selectedJob?.id === job.id ? 'ring-2 ring-[#8E44AD]' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2 text-[9px] font-bold">
                        <span className="font-mono text-gray-400">{job.id}</span>
                        <span className={`px-1.5 py-0.2 rounded ${
                          job.tier === 'SUPER PREMIUM' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-[#D35400]'
                        }`}>
                          {job.tier}
                        </span>
                      </div>

                      <h4 className="font-bold text-gray-800 text-xs truncate">{job.transporter}</h4>
                      <p className="text-gray-500 font-semibold mt-0.5">{job.source} ➔ {job.destination}</p>
                      
                      <div className="flex gap-1.5 mt-2 text-[9.5px] text-gray-400 font-semibold">
                        <span>{job.truckType}</span>
                        <span>·</span>
                        <span>{job.license}</span>
                      </div>

                      <div className="mt-3.5 pt-2 border-t border-gray-100 flex flex-col gap-1.5 text-[9.5px] text-gray-400 font-semibold">
                        <div className="flex justify-between">
                          <span>Posted {job.postedText}</span>
                          <span>{job.driversContacted} contacted</span>
                        </div>

                        {job.status !== 'Filled' && job.status !== 'Expired' && (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                              <div className={`h-full ${slaColor}`} style={{ width: `${(job.slaDaysLeft / job.totalSlaDays)*100}%` }}></div>
                            </div>
                            <span className="font-mono font-bold text-gray-600 shrink-0">{job.slaDaysLeft}d left</span>
                          </div>
                        )}
                      </div>

                      {/* Card actions */}
                      {job.status === 'Open' && (
                        <div className="mt-3.5 pt-2 border-t border-gray-100">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleTakeJob(job.id); }}
                            className="w-full bg-[#8E44AD] hover:bg-[#7D3C98] text-white py-1.5 rounded-lg font-bold text-center shadow-sm"
                          >
                            Take Job
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {colJobs.length === 0 && (
                  <div className="text-[10px] text-gray-400 italic py-8 text-center select-none">No jobs in column.</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* JOB DETAIL SLIDE-OUT PANEL */}
      {selectedJob && (
        <div className="absolute inset-y-0 right-0 w-[480px] bg-white border-l border-gray-250 shadow-2xl z-40 flex flex-col justify-between text-xs animate-in slide-in-from-right duration-250">
          <div>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-extrabold text-gray-800 uppercase tracking-wide text-xs">{selectedJob.transporter}</h3>
                <span className="text-[10px] text-gray-400 font-mono">{selectedJob.id}</span>
              </div>
              <button 
                onClick={() => setSelectedJob(null)}
                className="text-gray-400 hover:text-gray-600 font-bold px-1 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto custom-scrollbar">
              
              {/* Requirements block */}
              <div className="bg-gray-50 border border-gray-150 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Job Requirements</span>
                <div className="grid grid-cols-2 gap-2 text-gray-700 font-semibold text-[11px]">
                  <div>Route: <span className="font-bold text-gray-900">{selectedJob.source} ➔ {selectedJob.destination}</span></div>
                  <div>Truck Type: <span className="font-bold text-gray-900">{selectedJob.truckType}</span></div>
                  <div>License Required: <span className="font-bold text-gray-900">{selectedJob.license}</span></div>
                  <div>Experience: <span className="font-bold text-gray-900">{selectedJob.experience}</span></div>
                  <div>Duration: <span className="font-bold text-gray-900">{selectedJob.duration}</span></div>
                  <div>Start Date: <span className="font-bold text-gray-900">{selectedJob.startDate}</span></div>
                </div>
              </div>

              {/* Transporter contact */}
              <div className="bg-white border border-gray-200 rounded-xl p-3.5 flex justify-between items-center shadow-sm">
                <div>
                  <h4 className="font-bold text-gray-850">{selectedJob.transporter || 'Transporter Dispatcher'}</h4>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Mobile: {selectedJob.phone || '9988776655'}</p>
                </div>
                <button 
                  onClick={() => handleDialTransporter(selectedJob.transporter, selectedJob.phone || '9988776655', selectedJob.id)}
                  className="bg-white border border-[#8E44AD] text-[#8E44AD] hover:bg-[#8E44AD] hover:text-white px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">phone</span>
                  <span>Call Dispatcher</span>
                </button>
              </div>

              {/* Driver Shortlist */}
              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-extrabold text-gray-450 uppercase tracking-wider">Candidate Shortlist</h4>
                  <button 
                    onClick={() => navigate('/mm/mm-driver-search', { state: { jobId: selectedJob.id, requirements: selectedJob } })}
                    className="text-[#8E44AD] hover:underline font-extrabold text-[10px]"
                  >
                    + Find More Drivers
                  </button>
                </div>

                <div className="space-y-2">
                  {candidates.map((cand, idx) => {
                    const isInterested = cand.lastStatus === 'Interested';
                    return (
                      <div key={idx} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-bold text-gray-850 text-xs">{cand.name}</span>
                            <span className="text-[9.5px] text-gray-400 font-mono block mt-0.5">{cand.tmid} · {cand.location}</span>
                          </div>
                          <span className="bg-green-150 text-green-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                            {cand.matchPercent}% Match
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${
                            isInterested ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'
                          }`}>
                            {cand.lastStatus}
                          </span>

                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleDialDriver(cand.name, cand.phone || '9876543210', cand.tmid, selectedJob.id)}
                              className="bg-[#8E44AD] hover:bg-[#7D3C98] text-white px-3 py-1 rounded font-bold shadow-sm"
                            >
                              Call Candidate
                            </button>
                            {isInterested && (
                              <button 
                                onClick={() => navigate('/mm/mm-intro-manager', { state: { jobId: selectedJob.id, driverName: cand.name, driverTmid: cand.tmid } })}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded font-bold shadow-sm"
                              >
                                Create Intro Group
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-gray-150">
                <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Job Call Logs</span>
                <div className="space-y-1.5">
                  {callLogs.map((log, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px] font-semibold text-gray-500">
                      <span>{log.date} ➔ called {log.driver}</span>
                      <span className="text-gray-800">{log.outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-3">
            <button
              onClick={() => navigate('/mm/mm-placement-confirmation', { state: { jobId: selectedJob.id } })}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-bold text-center shadow-md cursor-pointer"
            >
              Mark Filled
            </button>
            <button
              onClick={() => setSelectedJob(null)}
              className="flex-1 bg-white border border-gray-200 text-gray-500 py-2 rounded-xl font-bold text-center"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </main>
  );
};

export default MmJobBoard;
