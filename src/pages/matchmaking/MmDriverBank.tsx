import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface VettedDriver {
  id: string;
  name: string;
  phone: string;
  tier: 'Verified' | 'Trusted' | 'Standard';
  city: string;
  routes: string;
  notes: string;
  lastContacted: string;
  status: 'Available' | 'Placed';
}

export const MmDriverBank: React.FC = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [editingDriverId, setEditingDriverId] = useState<string | null>(null);
  const [editNotesValue, setEditNotesValue] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mock vetted driver bank database
  const [vettedDrivers, setVettedDrivers] = useState<VettedDriver[]>([
    { id: 'DR-48291', name: 'Suresh Yadav', phone: '+91 98765 43210', tier: 'Verified', city: 'Delhi', routes: 'Delhi ➔ Mumbai', notes: 'Prefers long haul North routes, available July 10', lastContacted: 'Today, 11:30 AM', status: 'Available' },
    { id: 'DR-48292', name: 'Amit Singh', phone: '+91 88765 43211', tier: 'Trusted', city: 'Jaipur', routes: 'Jaipur ➔ Pune', notes: 'HMV class driver, prefers medium container routes', lastContacted: 'Yesterday', status: 'Available' },
    { id: 'DR-48293', name: 'Ramesh Kumar', phone: '+91 78765 43212', tier: 'Verified', city: 'Mumbai', routes: 'Mumbai ➔ Delhi', notes: 'Has 5+ yrs trailer exp, route flexible', lastContacted: '2 days ago', status: 'Available' },
    { id: 'DR-48296', name: 'Devendra Pal', phone: '+91 98234 11223', tier: 'Verified', city: 'Ahmedabad', routes: 'Ahmedabad ➔ Chennai', notes: 'Prefers South routes, container 24ft experienced', lastContacted: '3 days ago', status: 'Available' },
    { id: 'DR-48297', name: 'Harpreet Singh', phone: '+91 91112 23344', tier: 'Trusted', city: 'Amritsar', routes: 'Delhi ➔ Bangalore', notes: '32ft container trailer experience, strict SLA driver', lastContacted: 'Today, 09:12 AM', status: 'Available' },
    { id: 'DR-48299', name: 'Karan Johar', phone: '+91 99999 88888', tier: 'Standard', city: 'Patna', routes: 'Kolkata ➔ Patna', notes: 'LMV driver, available for local delivery', lastContacted: '5 days ago', status: 'Placed' }
  ]);

  const handleStartEditing = (id: string, currentNotes: string) => {
    setEditingDriverId(id);
    setEditNotesValue(currentNotes);
  };

  const handleSaveNotes = (id: string) => {
    setVettedDrivers(prev => prev.map(d => 
      d.id === id ? { ...d, notes: editNotesValue } : d
    ));
    setEditingDriverId(null);
    triggerToast('Notes updated successfully ✓');
  };

  const handleMarkStatus = (id: string, nextStatus: 'Available' | 'Placed') => {
    setVettedDrivers(prev => prev.map(d => 
      d.id === id ? { ...d, status: nextStatus } : d
    ));
    triggerToast(`Driver status marked: ${nextStatus} (Search pool updated) ✓`);
  };

  const handleRemoveDriver = (id: string, name: string) => {
    setVettedDrivers(prev => prev.filter(d => d.id !== id));
    triggerToast(`Removed ${name} from personal driver bank`);
  };

  const handleAddDriverSearch = () => {
    navigate('/mm/mm-driver-search');
  };

  return (
    <main className="p-6 max-w-7xl mx-auto w-full overflow-y-auto max-h-[calc(100vh-60px)] space-y-6 text-xs relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#8E44AD]"></span>
          {toastMessage}
        </div>
      )}

      {/* Header controls strip */}
      <div className="p-4 bg-gray-50 border border-gray-250 rounded-xl flex justify-between items-center shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide">My Driver Bank</h1>
            <span className="bg-green-100 text-green-700 text-[9.5px] px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5 select-none">
              <span className="material-symbols-outlined text-[13px]">check_circle</span>
              Last updated: Today ✓
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5">Manage your personal database of pre-vetted drivers for quick job matching</p>
        </div>

        <button 
          onClick={handleAddDriverSearch}
          className="bg-[#8E44AD] hover:bg-[#7D3C98] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          <span>Add Driver</span>
        </button>
      </div>

      {/* Table list */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-150 text-gray-450 font-bold uppercase text-[9px]">
              <th className="p-3 pl-4">Driver Name</th>
              <th className="p-3">Plan Tier</th>
              <th className="p-3">Base City</th>
              <th className="p-3">Routes Preference</th>
              <th className="p-3 w-72">Per-Driver Notes (Click to edit)</th>
              <th className="p-3">Last Contacted</th>
              <th className="p-3">Sourcing Availability</th>
              <th className="p-3 text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-750 font-medium">
            {vettedDrivers.map(d => {
              const isEditing = editingDriverId === d.id;
              const isPlaced = d.status === 'Placed';

              return (
                <tr key={d.id} className={`hover:bg-gray-50/30 transition-colors ${isPlaced ? 'opacity-65' : ''}`}>
                  <td className="p-3 pl-4">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-gray-800 text-xs">{d.name}</span>
                      <span className="text-[9.5px] text-gray-400 font-mono mt-0.5">{d.id} · {d.phone}</span>
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
                  <td className="p-3 font-mono font-bold text-gray-500">{d.routes}</td>
                  <td className="p-3 w-72">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <input 
                          type="text" 
                          value={editNotesValue}
                          onChange={(e) => setEditNotesValue(e.target.value)}
                          className="border border-gray-250 rounded px-2 py-1 outline-none text-gray-850 flex-1"
                        />
                        <button 
                          onClick={() => handleSaveNotes(d.id)}
                          className="bg-green-600 hover:bg-green-700 text-white p-1 rounded font-bold"
                          title="Save"
                        >
                          <span className="material-symbols-outlined text-xs block">check</span>
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => handleStartEditing(d.id, d.notes)}
                        className="p-1 hover:bg-gray-50 rounded cursor-pointer italic text-gray-500 font-semibold"
                      >
                        {d.notes || 'Click to enter driver remarks...'}
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-mono text-gray-450">{d.lastContacted}</td>
                  <td className="p-3">
                    <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                      isPlaced ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-3 text-right pr-4 space-x-2">
                    {isPlaced ? (
                      <button 
                        onClick={() => handleMarkStatus(d.id, 'Available')}
                        className="text-green-650 hover:underline font-extrabold text-[10px]"
                      >
                        Mark Available
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleMarkStatus(d.id, 'Placed')}
                        className="text-red-500 hover:underline font-bold text-[10px]"
                      >
                        Mark Placed
                      </button>
                    )}
                    <button 
                      onClick={() => handleRemoveDriver(d.id, d.name)}
                      className="text-gray-400 hover:text-red-600 transition-colors font-bold text-xs"
                      title="Remove from bank"
                    >
                      <span className="material-symbols-outlined text-[16px] block">delete</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </main>
  );
};

export default MmDriverBank;
