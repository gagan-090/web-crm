import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface CallHistory {
  date: string;
  duration: string;
  status: string;
  caller: string;
}

interface CampaignLead {
  id: string;
  tmid: string;
  name: string;
  phone: string;
  city: string;
  state: string;
  capturedTime: string;
  capturedTimestamp: number; // For sorting
  source: 'META ADS' | 'GOOGLE ADS' | 'INSTAGRAM' | 'FACEBOOK' | 'FB COMMENT' | 'IG COMMENT' | 'MANUAL';
  campaignName: string;
  adSet: string;
  leadForm: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  temperature: 'HOT' | 'WARM' | 'COLD';
  vehicleType: string;
  licenseType: string;
  experience: string;
  preferredRoute: string;
  subscribed: boolean;
  whatsapp: boolean;
  notes: string;
  isConverted: boolean;
  isCallback: boolean;
  callbackTime?: string;
  openingScript: string;
  history: CallHistory[];
}

export const DwCampaignLeads: React.FC = () => {
  const navigate = useNavigate();

  // Mock Campaign Leads Data matching Specification
  const [leads, setLeads] = useState<CampaignLead[]>([
    {
      id: 'CL1',
      tmid: 'DR-CMP-001',
      name: 'Ramesh Singh',
      phone: '+91-98765-11111',
      city: 'Delhi',
      state: 'Delhi',
      capturedTime: '12 mins ago',
      capturedTimestamp: Date.now() - 12 * 60000,
      source: 'META ADS',
      campaignName: 'Free HMV License Upgrade Promo',
      adSet: 'Delhi HMV Drivers - 25-45 age',
      leadForm: 'HMV Drivers Enrollment Form v2',
      utmSource: 'facebook',
      utmMedium: 'cpc',
      utmCampaign: 'delhi_hmv_upgrade',
      temperature: 'HOT',
      vehicleType: 'Heavy Multi-axle Truck',
      licenseType: 'HMV',
      experience: '8 years',
      preferredRoute: 'Delhi–Mumbai Express',
      subscribed: false,
      whatsapp: true,
      notes: 'Driver clicked the Meta Ad for Free License Upgrade. Interested in immediate verified plan.',
      isConverted: false,
      isCallback: false,
      openingScript: 'Namaste Ramesh ji, main TruckMitr se bol raha hu. Aapne Facebook par hamara Heavy License Upgrade ka vigyapan dekha tha...',
      history: [
        { date: '21 Jun, 4:30 PM', duration: '0m 0s', status: 'NR', caller: 'You' }
      ]
    },
    {
      id: 'CL2',
      tmid: 'DR-CMP-002',
      name: 'Balwinder Singh',
      phone: '+91-98123-22222',
      city: 'Amritsar',
      state: 'Punjab',
      capturedTime: '45 mins ago',
      capturedTimestamp: Date.now() - 45 * 60000,
      source: 'GOOGLE ADS',
      campaignName: 'Truck Driver High Salary Placement',
      adSet: 'Search - Punjab Truckers',
      leadForm: 'Google Lead Extension - Punjab',
      utmSource: 'google',
      utmMedium: 'search_cpc',
      utmCampaign: 'punjab_placement_leads',
      temperature: 'HOT',
      vehicleType: 'Heavy Truck (14 Wheeler)',
      licenseType: 'HMV',
      experience: '12 years',
      preferredRoute: 'Punjab–Gujarat Route',
      subscribed: false,
      whatsapp: true,
      notes: 'High experience driver searching for high salary job. Google search lead.',
      isConverted: false,
      isCallback: false,
      openingScript: 'Namaste Balwinder ji, main TruckMitr se baat kar raha hu. Aapne Google par naukri ki khoj karte samay apna number choda tha...',
      history: []
    },
    {
      id: 'CL3',
      tmid: 'DR-CMP-003',
      name: 'Manoj Kumar',
      phone: '+91-99887-33333',
      city: 'Gurugram',
      state: 'Haryana',
      capturedTime: '2 hours ago',
      capturedTimestamp: Date.now() - 120 * 60000,
      source: 'INSTAGRAM',
      campaignName: 'Driver Benefits & Insurance Drive',
      adSet: 'Instagram Reels - Driver Life',
      leadForm: 'Instagram Instant Form',
      utmSource: 'instagram',
      utmMedium: 'story_ads',
      utmCampaign: 'insurance_drive_reels',
      temperature: 'WARM',
      vehicleType: 'Tata Ace (Chota Hathi)',
      licenseType: 'LMV',
      experience: '3 years',
      preferredRoute: 'Delhi NCR Local',
      subscribed: true,
      whatsapp: true,
      notes: 'Warm lead. Inquired about accident cover of 5 lakhs. Has Tata Ace.',
      isConverted: false,
      isCallback: true,
      callbackTime: 'Today, 4:00 PM',
      openingScript: 'Namaste Manoj ji, main TruckMitr se baat kar raha hu. Aapne Instagram Story par Bima yojana wala post dekha tha...',
      history: [
        { date: '22 Jun, 10:00 AM', duration: '1m 20s', status: 'Connected', caller: 'You' }
      ]
    },
    {
      id: 'CL4',
      tmid: 'DR-CMP-004',
      name: 'Dinesh Prasad',
      phone: '+91-77665-44444',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      capturedTime: '1 day ago',
      capturedTimestamp: Date.now() - 1440 * 60000,
      source: 'FB COMMENT',
      campaignName: 'Direct Sourced FB Group Comments',
      adSet: 'UP Truckers Association Group',
      leadForm: 'Comment Scraping tool',
      utmSource: 'facebook_groups',
      utmMedium: 'organic_comment',
      utmCampaign: 'direct_scraping_v1',
      temperature: 'COLD',
      vehicleType: 'Container Truck',
      licenseType: 'HMV',
      experience: '5 years',
      preferredRoute: 'Lucknow–Kolkata',
      subscribed: false,
      whatsapp: false,
      notes: 'Direct scrap from comment saying "Job needed HMV license Lucknow". Dialing cold.',
      isConverted: false,
      isCallback: false,
      openingScript: 'Namaste Dinesh ji, kya aap Lucknow se Container chalane ki naukri dhoond rahe hain? Aapne FB par comment kiya tha...',
      history: []
    },
    {
      id: 'CL5',
      tmid: 'DR-CMP-005',
      name: 'Satnam Singh',
      phone: '+91-99881-55555',
      city: 'Ludhiana',
      state: 'Punjab',
      capturedTime: '2 days ago',
      capturedTimestamp: Date.now() - 2880 * 60000,
      source: 'FACEBOOK',
      campaignName: 'Free HMV License Upgrade Promo',
      adSet: 'Punjab HMV Drivers',
      leadForm: 'HMV Enrollment Form v2',
      utmSource: 'facebook',
      utmMedium: 'cpc',
      utmCampaign: 'punjab_hmv_upgrade',
      temperature: 'WARM',
      vehicleType: 'Trailer Truck',
      licenseType: 'HMV',
      experience: '10 years',
      preferredRoute: 'Punjab–Maharashtra Route',
      subscribed: true,
      whatsapp: true,
      notes: 'Lead successfully called and converted. verified plan active.',
      isConverted: true,
      isCallback: false,
      openingScript: 'Namaste Satnam ji, TruckMitr se baat kar raha hu...',
      history: [
        { date: '20 Jun, 12:00 PM', duration: '3m 45s', status: 'Connected', caller: 'You' }
      ]
    }
  ]);

  // UI States
  const [selectedId, setSelectedId] = useState<string>('CL1');
  const [activeTab, setActiveTab] = useState<'all' | 'hot' | 'warm' | 'cold' | 'callbacks' | 'converted'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'temperature' | 'newest' | 'oldest' | 'callbacks'>('temperature');
  const [toast, setToast] = useState<string | null>(null);

  // Notes Auto-Save
  const [notesText, setNotesText] = useState<string>('');
  const [saveTimestamp, setSaveTimestamp] = useState<string>('');
  const saveTimerRef = useRef<any | null>(null);

  const selectedLead = leads.find(l => l.id === selectedId) || leads[0];

  useEffect(() => {
    if (selectedLead) {
      setNotesText(selectedLead.notes);
      setSaveTimestamp('');
    }
  }, [selectedId]);

  const handleNotesChange = (val: string) => {
    setNotesText(val);
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      setLeads(prevLeads =>
        prevLeads.map(l => (l.id === selectedLead.id ? { ...l, notes: val } : l))
      );
      const now = new Date();
      setSaveTimestamp(`Saved at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Temperature Border Colors
  const getBorderColorClass = (temp: 'HOT' | 'WARM' | 'COLD') => {
    if (temp === 'HOT') return 'border-red-500';
    if (temp === 'WARM') return 'border-amber-500';
    return 'border-blue-500';
  };

  // Source Chip Styles
  const getSourceChipStyle = (source: string) => {
    switch (source) {
      case 'META ADS':
      case 'FACEBOOK':
      case 'FB COMMENT':
        return { backgroundColor: '#1877F2', color: '#FFFFFF' };
      case 'GOOGLE ADS':
        return { backgroundColor: '#4285F4', color: '#FFFFFF' };
      case 'INSTAGRAM':
      case 'IG COMMENT':
        return { backgroundColor: '#E1306C', color: '#FFFFFF' };
      default:
        return { backgroundColor: '#7F8C8D', color: '#FFFFFF' };
    }
  };

  // Filter & Sort Logic
  const getFilteredLeads = () => {
    let result = [...leads];

    // Temperature tab filter
    if (activeTab === 'hot') result = result.filter(l => l.temperature === 'HOT' && !l.isConverted);
    else if (activeTab === 'warm') result = result.filter(l => l.temperature === 'WARM' && !l.isConverted);
    else if (activeTab === 'cold') result = result.filter(l => l.temperature === 'COLD' && !l.isConverted);
    else if (activeTab === 'callbacks') result = result.filter(l => l.isCallback && !l.isConverted);
    else if (activeTab === 'converted') result = result.filter(l => l.isConverted);
    else result = result.filter(l => !l.isConverted); // 'all' default filters out converted from main list

    // Source Filter
    if (sourceFilter !== 'ALL') {
      result = result.filter(l => l.source === sourceFilter);
    }

    // Sort Logic
    if (sortBy === 'temperature') {
      const priority = { HOT: 3, WARM: 2, COLD: 1 };
      result.sort((a, b) => priority[b.temperature] - priority[a.temperature]);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.capturedTimestamp - a.capturedTimestamp);
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => a.capturedTimestamp - b.capturedTimestamp);
    } else if (sortBy === 'callbacks') {
      result.sort((a, b) => (b.isCallback ? 1 : 0) - (a.isCallback ? 1 : 0));
    }

    return result;
  };

  const filteredLeads = getFilteredLeads();

  // Active call trigger
  const handleCallNow = (lead: CampaignLead) => {
    triggerToast(`Initiating outbound call to ${lead.name}...`);
    navigate('/dw/dw-active-call-focus', {
      state: {
        leadId: lead.id,
        tmid: lead.tmid,
        name: lead.name,
        phone: lead.phone,
        location: `${lead.city}, ${lead.state}`,
        vehicleType: lead.vehicleType,
        licenseType: lead.licenseType,
        experience: lead.experience,
        preferredRoute: lead.preferredRoute,
        subscribed: lead.subscribed,
        whatsapp: lead.whatsapp,
        history: lead.history,
        isCampaign: true,
        campaignContext: {
          source: lead.source,
          campaignName: lead.campaignName,
          adSet: lead.adSet,
          leadForm: lead.leadForm,
          capturedTime: lead.capturedTime,
          utmSource: lead.utmSource,
          utmMedium: lead.utmMedium,
          utmCampaign: lead.utmCampaign,
          temperature: lead.temperature,
          openingScript: lead.openingScript
        }
      }
    });
  };

  return (
    <main className="h-[calc(100vh-80px)] flex bg-white overflow-hidden border border-gray-200 rounded-xl relative">
      {/* Toast */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#27AE60]"></span>
          {toast}
        </div>
      )}

      {/* Left Panel - Staging Campaign Queue */}
      <section className="w-[390px] border-r border-gray-200 flex flex-col bg-gray-50/50 shrink-0">
        
        {/* Campaign Info Strip */}
        <div className="bg-red-500/10 border-b border-red-200 px-3 py-2 text-[11px] text-red-800 font-semibold flex justify-between items-center shrink-0">
          <span className="flex items-center gap-1">
            <span className="animate-pulse">🔥</span> 
            <span>12 Hot Campaign Leads Piled Up</span>
          </span>
          <span className="bg-red-500 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-full uppercase">SLA Warning</span>
        </div>

        {/* Filters and Sort Header */}
        <div className="p-3 border-b border-gray-200 shrink-0 bg-white space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Campaign Queue</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-400">Sort:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[11px] font-semibold text-gray-700 border-none outline-none cursor-pointer focus:ring-0 p-0"
              >
                <option value="temperature">Temperature</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="callbacks">Callbacks First</option>
              </select>
            </div>
          </div>

          {/* Lead Source Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 shrink-0 font-medium">Source:</span>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="flex-1 text-[11px] font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded px-2 py-1 outline-none"
            >
              <option value="ALL">All Campaign Sources</option>
              <option value="META ADS">Meta Ads</option>
              <option value="GOOGLE ADS">Google Ads</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="FB COMMENT">FB Comments</option>
              <option value="IG COMMENT">Instagram Comments</option>
              <option value="MANUAL">Manual</option>
            </select>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Leads' },
              { id: 'hot', label: '🔥 Hot' },
              { id: 'warm', label: '~ Warm' },
              { id: 'cold', label: '❄ Cold' },
              { id: 'callbacks', label: 'Callbacks' },
              { id: 'converted', label: 'Converted' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap border transition-colors ${
                  activeTab === tab.id
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lead Card List */}
        <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-gray-100">
          {filteredLeads.length > 0 ? (
            filteredLeads.map(l => (
              <div 
                key={l.id}
                onClick={() => setSelectedId(l.id)}
                className={`p-3 cursor-pointer flex border-l-4 transition-all relative ${getBorderColorClass(l.temperature)} ${
                  l.id === selectedId ? 'bg-red-500/5 font-medium' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-bold text-gray-900 truncate">{l.name}</span>
                    <span 
                      className="text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wide shrink-0"
                      style={getSourceChipStyle(l.source)}
                    >
                      {l.source}
                    </span>
                  </div>

                  <div className="text-[12px] text-gray-500 mt-1 flex justify-between">
                    <span>{l.city}, {l.state}</span>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1 rounded font-mono">{l.tmid}</span>
                  </div>

                  <div className="text-[11px] text-gray-400 mt-2 flex justify-between items-center">
                    <span>Captured: {l.capturedTime}</span>
                    <span className={`text-[10px] font-bold px-1 py-0.25 rounded ${
                      l.temperature === 'HOT' ? 'bg-red-100 text-red-700' :
                      l.temperature === 'WARM' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {l.temperature}
                    </span>
                  </div>

                  {l.campaignName && (
                    <div className="mt-1.5 text-[10px] text-red-600/80 font-medium truncate">
                      📣 {l.campaignName}
                    </div>
                  )}

                  {l.isCallback && (
                    <div className="mt-1 text-[10px] text-amber-600 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">schedule</span>
                      Callback: {l.callbackTime}
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleCallNow(l); }}
                    className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow transition-transform active:scale-95"
                    title="Call Now"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-xs italic">
              No campaign leads found matching current criteria.
            </div>
          )}
        </div>
      </section>

      {/* Right Panel - Campaign Lead Details Profile Cockpit */}
      <section className="flex-1 flex flex-col bg-white overflow-hidden min-w-0">
        
        {/* Detail Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Header Block */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{selectedLead.name}</h1>
                <span className="font-mono text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{selectedLead.tmid}</span>
                <span 
                  className="text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase"
                  style={getSourceChipStyle(selectedLead.source)}
                >
                  {selectedLead.source}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  selectedLead.temperature === 'HOT' ? 'bg-red-500 text-white animate-pulse' :
                  selectedLead.temperature === 'WARM' ? 'bg-amber-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  {selectedLead.temperature} LEAD
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{selectedLead.city}, {selectedLead.state} | {selectedLead.phone}</p>
            </div>

            <button 
              onClick={() => handleCallNow(selectedLead)}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg shadow-md font-bold transition-all active:scale-95 text-sm"
            >
              <span className="material-symbols-outlined text-[18px]">call</span>
              Start Campaign Call
            </button>
          </div>

          <hr className="border-gray-200" />

          {/* Campaign Context Strip Card */}
          <div className="bg-gradient-to-r from-red-500/5 to-amber-500/5 border border-red-500/20 rounded-xl p-4 space-y-3">
            <h2 className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-red-500">campaign</span>
              Meta/Google Campaign Attribution Details
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block mb-0.5">Campaign Name</span>
                <span className="font-bold text-gray-800">{selectedLead.campaignName}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Ad Set Group</span>
                <span className="font-semibold text-gray-800">{selectedLead.adSet}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">Lead Capture Form</span>
                <span className="font-semibold text-gray-800">{selectedLead.leadForm}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">UTM Source</span>
                <span className="font-mono text-gray-700 bg-gray-100 px-1 py-0.5 rounded">{selectedLead.utmSource}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">UTM Medium</span>
                <span className="font-mono text-gray-700 bg-gray-100 px-1 py-0.5 rounded">{selectedLead.utmMedium}</span>
              </div>
              <div>
                <span className="text-gray-400 block mb-0.5">UTM Campaign</span>
                <span className="font-mono text-gray-700 bg-gray-100 px-1 py-0.5 rounded">{selectedLead.utmCampaign}</span>
              </div>
            </div>
          </div>

          {/* Profile Details & Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Caller Data */}
            <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
                <span className="material-symbols-outlined text-[16px] text-primary">person</span>
                Driver Profile Details
              </h3>
              <table className="w-full text-xs text-left">
                <tbody>
                  <tr className="border-b border-gray-50"><td className="py-2 text-gray-400">Vehicle Preference</td><td className="py-2 font-bold text-gray-800">{selectedLead.vehicleType}</td></tr>
                  <tr className="border-b border-gray-50"><td className="py-2 text-gray-400">License Type</td><td className="py-2 font-bold text-gray-800">{selectedLead.licenseType}</td></tr>
                  <tr className="border-b border-gray-50"><td className="py-2 text-gray-400">Experience</td><td className="py-2 font-bold text-gray-800">{selectedLead.experience}</td></tr>
                  <tr><td className="py-2 text-gray-400">Preferred Route</td><td className="py-2 font-bold text-gray-800">{selectedLead.preferredRoute}</td></tr>
                </tbody>
              </table>
            </div>

            {/* Script Opening Assist */}
            <div className="border border-red-200 rounded-xl p-4 space-y-3 bg-red-50/20">
              <h3 className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-red-100 pb-2">
                <span className="material-symbols-outlined text-[16px] text-red-500">rate_review</span>
                Campaign Opening Script Assist
              </h3>
              <p className="text-xs text-gray-700 italic bg-white p-3 rounded-lg border border-red-100 shadow-sm leading-relaxed">
                "{selectedLead.openingScript}"
              </p>
              <div className="text-[10px] text-red-500 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">info</span>
                Tip: Reference the ad source and free upgrade topic immediately to capture interest.
              </div>
            </div>

          </div>

          {/* Interactive Notes Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Caller Notes</label>
              <span className="text-[10px] text-gray-400 font-mono">{saveTimestamp}</span>
            </div>
            <textarea
              value={notesText}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Type call notes here... Auto-saves in 2 seconds"
              className="w-full h-24 border border-gray-200 rounded-lg p-3 text-xs focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>

          {/* Call & Status History */}
          <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-2">
              Engagement History
            </h3>
            {selectedLead.history.length > 0 ? (
              <div className="space-y-2.5">
                {selectedLead.history.map((hist, i) => (
                  <div key={i} className="flex justify-between items-center text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        hist.status === 'Connected' ? 'bg-[#27AE60]' : 'bg-red-500'
                      }`}></span>
                      <span className="font-bold text-gray-800">{hist.status}</span>
                      <span className="text-[11px] text-gray-400">Duration: {hist.duration}</span>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      <span>{hist.date}</span> | <span className="font-semibold">{hist.caller}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic text-center py-2">No calls logged yet. This is a fresh campaign lead.</p>
            )}
          </div>

        </div>
      </section>
    </main>
  );
};
export default DwCampaignLeads;
