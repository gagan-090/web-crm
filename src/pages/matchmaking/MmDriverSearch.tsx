import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetMmDriversQuery } from '../../services/api/webCrmApi';

interface DriverItem {
  id: string;
  name: string;
  phone: string;
  tier: 'Verified' | 'Trusted' | 'Standard';
  city: string;
  routes: string;
  experience: number;
  lastActive: string;
  truckType: string;
  license: string;
}

export const MmDriverSearch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Job context passed from details page
  const state = location.state || {};
  const jobId = state.jobId || null;
  const jobRequirements = state.requirements || null;

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Filter states
  const [originState, setOriginState] = useState('');
  const [destState, setDestState] = useState('');
  const [selectedTrucks, setSelectedTrucks] = useState<string[]>([]);
  const [licenseClass, setLicenseClass] = useState<string[]>([]);
  const [planTier, setPlanTier] = useState<string>('All');
  const [locationInput, setLocationInput] = useState('');
  const [experienceLimit, setExperienceLimit] = useState(5);

  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const { data: liveDriversData } = useGetMmDriversQuery({
    origin: originState || undefined,
    destination: destState || undefined,
    license: licenseClass.length > 0 ? licenseClass[0] : undefined
  });

  const mockDrivers: DriverItem[] = [
    { id: 'DR-48291', name: 'Suresh Yadav', phone: '+91 98765 43210', tier: 'Verified', city: 'Delhi', routes: 'Delhi ➔ Mumbai', experience: 6, lastActive: 'Today', truckType: 'Heavy Truck', license: 'HMV' },
    { id: 'DR-48292', name: 'Amit Singh', phone: '+91 88765 43211', tier: 'Trusted', city: 'Jaipur', routes: 'Jaipur ➔ Pune', experience: 4, lastActive: 'Yesterday', truckType: 'Medium Truck', license: 'HMV' },
    { id: 'DR-48293', name: 'Ramesh Kumar', phone: '+91 78765 43212', tier: 'Verified', city: 'Mumbai', routes: 'Mumbai ➔ Delhi', experience: 5, lastActive: '2 days ago', truckType: 'Heavy Truck', license: 'HMV' },
    { id: 'DR-48296', name: 'Devendra Pal', phone: '+91 98234 11223', tier: 'Verified', city: 'Ahmedabad', routes: 'Ahmedabad ➔ Chennai', experience: 5, lastActive: '3 days ago', truckType: 'Container 24ft', license: 'HMV' },
    { id: 'DR-48297', name: 'Harpreet Singh', phone: '+91 91112 23344', tier: 'Trusted', city: 'Amritsar', routes: 'Delhi ➔ Bangalore', experience: 7, lastActive: 'Today', truckType: 'Container 32ft', license: 'HMV' },
    { id: 'DR-48299', name: 'Karan Johar', phone: '+91 99999 88888', tier: 'Standard', city: 'Patna', routes: 'Kolkata ➔ Patna', experience: 2, lastActive: '5 days ago', truckType: 'Light Commercial', license: 'LMV' }
  ];

  const drivers = liveDriversData?.drivers && liveDriversData.drivers.length > 0
    ? liveDriversData.drivers.map((d: any) => ({
        id: d.tmid || `DR-${d.id}`,
        name: d.name,
        phone: d.phone,
        tier: 'Verified' as const,
        city: d.city || 'Delhi',
        routes: d.routes || 'Delhi ➔ Mumbai',
        experience: parseInt(d.experience, 10) || 5,
        lastActive: 'Today',
        truckType: 'Heavy Truck',
        license: d.license || 'HMV'
      }))
    : mockDrivers;

  const handleToggleTruck = (truck: string) => {
    setSelectedTrucks(prev => 
      prev.includes(truck) ? prev.filter(t => t !== truck) : [...prev, truck]
    );
  };

  const handleToggleLicense = (lic: string) => {
    setLicenseClass(prev => 
      prev.includes(lic) ? prev.filter(l => l !== lic) : [...prev, lic]
    );
  };

  // Filter application
  const filteredDrivers = drivers.filter(d => {
    const matchesTier = planTier === 'All' || d.tier === planTier;
    const matchesLocation = !locationInput || d.city.toLowerCase().includes(locationInput.toLowerCase());
    const matchesExperience = d.experience >= experienceLimit;
    const matchesOrigin = !originState || d.routes.includes(originState);
    const matchesDest = !destState || d.routes.includes(destState);
    const matchesTruck = selectedTrucks.length === 0 || selectedTrucks.includes(d.truckType);
    const matchesLicense = licenseClass.length === 0 || licenseClass.includes(d.license);

    return matchesTier && matchesLocation && matchesExperience && matchesOrigin && matchesDest && matchesTruck && matchesLicense;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedDrivers(filteredDrivers.map(d => d.id));
    } else {
      setSelectedDrivers([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedDrivers(prev => [...prev, id]);
    } else {
      setSelectedDrivers(prev => prev.filter(item => item !== id));
    }
  };

  const handleAddIndividual = (driverName: string) => {
    triggerToast(`Added ${driverName} to job ${jobId || 'Shortlist'} ✓`);
  };

  const handleAddBulk = () => {
    if (selectedDrivers.length === 0) return;
    triggerToast(`Bulk added ${selectedDrivers.length} candidates to job ${jobId || 'Shortlist'} ✓`);
    setSelectedDrivers([]);
  };

  const handleResetFilters = () => {
    setOriginState('');
    setDestState('');
    setSelectedTrucks([]);
    setLicenseClass([]);
    setPlanTier('All');
    setLocationInput('');
    setExperienceLimit(1);
    triggerToast('Filters reset to defaults');
  };

  return (
    <main className="flex h-[calc(100vh-60px)] bg-white overflow-hidden relative text-xs">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#8E44AD]"></span>
          {toastMessage}
        </div>
      )}

      {/* Filter panel on the left (280px) */}
      <aside className="w-72 bg-gray-50 border-r border-gray-200 p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide border-b border-gray-200 pb-2">
            Match Sourcing Filters
          </h3>

          {/* Route origin/destination */}
          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Routes Preference</label>
            <div className="grid grid-cols-2 gap-2">
              <select 
                value={originState}
                onChange={(e) => setOriginState(e.target.value)}
                className="w-full border border-gray-200 rounded p-1 px-1.5 outline-none font-semibold text-gray-700 bg-white"
              >
                <option value="">Origin State</option>
                <option value="Delhi">Delhi</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Kolkata">Kolkata</option>
              </select>

              <select 
                value={destState}
                onChange={(e) => setDestState(e.target.value)}
                className="w-full border border-gray-200 rounded p-1 px-1.5 outline-none font-semibold text-gray-700 bg-white"
              >
                <option value="">Dest State</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Delhi">Delhi</option>
                <option value="Chennai">Chennai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Patna">Patna</option>
              </select>
            </div>
          </div>

          {/* Truck types chips */}
          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Truck Types</label>
            <div className="flex flex-wrap gap-1.5">
              {['Heavy Truck', 'Medium Truck', 'Light Commercial', 'Container 24ft', 'Container 32ft', 'Taurus 14W'].map(t => {
                const isSelected = selectedTrucks.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => handleToggleTruck(t)}
                    className={`px-2 py-0.5 rounded border font-semibold text-[10px] ${
                      isSelected 
                        ? 'bg-purple-100 border-[#8E44AD] text-[#7D3C98]' 
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* License class */}
          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">License Required</label>
            <div className="flex gap-2">
              {['HMV', 'LMV', 'MCV'].map(l => {
                const isSelected = licenseClass.includes(l);
                return (
                  <button
                    key={l}
                    onClick={() => handleToggleLicense(l)}
                    className={`flex-1 py-1.5 rounded-lg border font-bold text-center ${
                      isSelected 
                        ? 'bg-purple-100 border-[#8E44AD] text-[#7D3C98]' 
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {l}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Plan tier */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Vetting Plan Tier</label>
            <div className="space-y-1">
              {['All', 'Verified', 'Trusted', 'Standard'].map(p => (
                <label key={p} className="flex items-center gap-2 font-semibold text-gray-700 cursor-pointer">
                  <input 
                    type="radio" 
                    name="planTier"
                    checked={planTier === p}
                    onChange={() => setPlanTier(p)}
                    className="text-[#8E44AD] focus:ring-[#8E44AD]"
                  />
                  <span>{p}</span>
                </label>
              ))}
            </div>
          </div>

          {/* City / Hub location */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Hub / Base City</label>
            <input 
              type="text" 
              placeholder="e.g. Delhi Hub" 
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              className="w-full border border-gray-200 rounded p-1.5 px-2.5 outline-none font-semibold text-gray-800 bg-white"
            />
          </div>

          {/* Experience slider */}
          <div className="space-y-2">
            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block flex justify-between">
              <span>Min Experience</span>
              <span className="text-gray-800 font-bold font-mono">{experienceLimit} years</span>
            </label>
            <input 
              type="range" 
              min={1}
              max={15}
              value={experienceLimit}
              onChange={(e) => setExperienceLimit(Number(e.target.value))}
              className="w-full accent-[#8E44AD] cursor-pointer"
            />
          </div>

        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2 shrink-0">
          <button 
            onClick={handleResetFilters}
            className="w-full py-2 bg-white border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </aside>

      {/* Main Sourcing Results Section */}
      <section className="flex-1 flex flex-col overflow-hidden">
        
        {/* Linked Job Context Banner */}
        {jobId && (
          <div className="bg-purple-50 border-b border-purple-200 text-[#7D3C98] p-3 flex justify-between items-center shrink-0 font-bold">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">explore</span>
              <span>Sourcing Candidates for {jobId} ({jobRequirements?.transporter}): {jobRequirements?.source} ➔ {jobRequirements?.destination} · {jobRequirements?.truckType}</span>
            </div>
            <button 
              onClick={() => navigate('/mm/mm-job-board')}
              className="underline text-[10.5px]"
            >
              Back to Job Board
            </button>
          </div>
        )}

        {/* Results Toolbar */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center shrink-0 font-bold select-none text-gray-500">
          <span>Found {filteredDrivers.length} matching driver candidates</span>
          
          {selectedDrivers.length > 0 && (
            <button 
              onClick={handleAddBulk}
              className="bg-[#8E44AD] hover:bg-[#7D3C98] text-white px-3.5 py-1.5 rounded-lg shadow-sm text-xs font-bold transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">group_add</span>
              <span>Add selected ({selectedDrivers.length}) to shortlist</span>
            </button>
          )}
        </div>

        {/* Drivers table list */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-200 text-gray-400 font-bold uppercase text-[9px] sticky top-0 shadow-sm z-10">
                <th className="p-3 pl-4 w-12">
                  <input 
                    type="checkbox" 
                    checked={filteredDrivers.length > 0 && selectedDrivers.length === filteredDrivers.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-[#8E44AD] focus:ring-[#8E44AD]"
                  />
                </th>
                <th className="p-3">Driver Details</th>
                <th className="p-3">Plan Vetting</th>
                <th className="p-3">Base City</th>
                <th className="p-3">Truck Type</th>
                <th className="p-3">Experience</th>
                <th className="p-3">Preferred Route</th>
                <th className="p-3 text-right pr-4">Sourcing Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {filteredDrivers.map(d => {
                const isChecked = selectedDrivers.includes(d.id);
                return (
                  <tr key={d.id} className={`hover:bg-gray-50/50 transition-colors ${isChecked ? 'bg-purple-50/20' : ''}`}>
                    <td className="p-3 pl-4">
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={(e) => handleSelectOne(d.id, e.target.checked)}
                        className="rounded border-gray-300 text-[#8E44AD] focus:ring-[#8E44AD]"
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-gray-800 text-xs">{d.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono mt-0.5">{d.id} · {d.phone}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${
                        d.tier === 'Verified' ? 'bg-green-50 text-green-700 border-green-200' :
                        d.tier === 'Trusted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        {d.tier}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-gray-800">{d.city}</td>
                    <td className="p-3 text-gray-500 font-semibold">{d.truckType}</td>
                    <td className="p-3 font-mono font-bold text-gray-900">{d.experience} years</td>
                    <td className="p-3 font-mono font-bold text-gray-600">{d.routes}</td>
                    <td className="p-3 text-right pr-4 space-x-2">
                      <button 
                        onClick={() => handleAddIndividual(d.name)}
                        className="text-[#8E44AD] hover:underline font-extrabold text-[10.5px]"
                      >
                        Add to Shortlist
                      </button>
                      <button 
                        onClick={() => triggerToast(`Added ${d.name} to personal Driver Bank ✓`)}
                        className="text-gray-500 hover:text-gray-800 font-semibold text-[10px]"
                      >
                        + Bank
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredDrivers.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-400 italic">No candidates match your active sourcing filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </main>
  );
};

export default MmDriverSearch;
