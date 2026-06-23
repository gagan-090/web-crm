import React, { useState } from 'react';

interface CallRecord {
  id: string;
  dateTime: string;
  caller: string;
  process: 'DW' | 'TR' | 'MM' | 'SC';
  context: string;
  tmid: string;
  duration: string;
  outcome: 'Connected' | 'NR' | 'Busy' | 'Switch Off' | 'Converted';
  disposition: string;
  qcAudited: boolean;
  qcScore: number | null;
  recordingUrl: string;
  leadSource?: string;
}

interface ChatRecord {
  id: string;
  date: string;
  caller: string;
  process: 'DW' | 'TR' | 'MM' | 'SC';
  contactName: string;
  tmid: string;
  lastMessage: string;
  messageCount: number;
  channel: 'WhatsApp' | 'SMS';
  leadSource?: string;
}

interface ChatMessage {
  sender: 'caller' | 'lead';
  text: string;
  timestamp: string;
}

export const ThGlobalCallChatLog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CALL' | 'CHAT'>('CALL');
  const [playingCallId, setPlayingCallId] = useState<string | null>(null);
  const [viewingChat, setViewingChat] = useState<ChatRecord | null>(null);
  
  // Filters state
  const [processFilter, setProcessFilter] = useState('ALL');
  const [callerFilter, setCallerFilter] = useState('ALL');
  const [outcomeFilter, setOutcomeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);

  // Selected lead slideout
  const [selectedLead, setSelectedLead] = useState<CallRecord | null>(null);

  // Mock call recordings
  const calls: CallRecord[] = [
    { id: 'c-1', dateTime: '2026-06-20 11:30', caller: 'Sonam', process: 'DW', context: 'Rajesh Kumar', tmid: 'DR-48291', duration: '03:12', outcome: 'Converted', disposition: 'Job Ready Pack Sold', qcAudited: true, qcScore: 88, recordingUrl: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg', leadSource: 'META ADS' },
    { id: 'c-2', dateTime: '2026-06-20 11:15', caller: 'Ravi', process: 'TR', context: 'Balaji Freight', tmid: 'TR-12098', duration: '05:40', outcome: 'Connected', disposition: 'Callback Scheduled', qcAudited: false, qcScore: null, recordingUrl: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg', leadSource: 'GOOGLE ADS' },
    { id: 'c-3', dateTime: '2026-06-20 10:45', caller: 'Rohit K.', process: 'MM', context: 'Swift Carriers Match', tmid: 'DR-50112', duration: '07:22', outcome: 'Converted', disposition: 'Placement Confirmed', qcAudited: true, qcScore: 94, recordingUrl: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg', leadSource: 'ORGANIC' },
    { id: 'c-4', dateTime: '2026-06-20 10:12', caller: 'Akash Thakur', process: 'SC', context: 'Om Transport Puncture Sathi', tmid: 'FM-00231', duration: '04:15', outcome: 'Connected', disposition: 'Interested', qcAudited: true, qcScore: 82, recordingUrl: 'https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg', leadSource: 'IG COMMENT' },
    { id: 'c-5', dateTime: '2026-06-20 09:30', caller: 'Ankit Singh', process: 'DW', context: 'Suresh Yadav', tmid: 'DR-48190', duration: '01:10', outcome: 'NR', disposition: 'No Response', qcAudited: false, qcScore: null, recordingUrl: '', leadSource: 'FB COMMENT' },
  ];

  // Mock chat records
  const chats: ChatRecord[] = [
    { id: 'ch-1', date: '2026-06-20 11:42', caller: 'Sonam', process: 'DW', contactName: 'Rajesh Kumar', tmid: 'DR-48291', lastMessage: 'Thank you, I have uploaded my Driving License screenshot.', messageCount: 8, channel: 'WhatsApp', leadSource: 'META ADS' },
    { id: 'ch-2', date: '2026-06-20 11:28', caller: 'Ravi', process: 'TR', contactName: 'Garg Logistics', tmid: 'TR-12098', lastMessage: 'Please share the GST verification link again.', messageCount: 14, channel: 'WhatsApp', leadSource: 'GOOGLE ADS' },
    { id: 'ch-3', date: '2026-06-20 10:50', caller: 'Pooja Pal', process: 'MM', contactName: 'Balaji Freight (Manoj)', tmid: 'JD-12034', lastMessage: 'Driver details shared. Checking availability.', messageCount: 5, channel: 'WhatsApp', leadSource: 'ORGANIC' },
    { id: 'ch-4', date: '2026-06-20 09:15', caller: 'Akash Thakur', process: 'SC', contactName: 'Sharma Dhaba & Rest', tmid: 'FM-00231', lastMessage: 'Commission slab approved. Awaiting registration.', messageCount: 22, channel: 'WhatsApp', leadSource: 'IG COMMENT' },
  ];

  // Mock chat conversation messages
  const chatMessages: ChatMessage[] = [
    { sender: 'caller', text: 'Hello, welcome to TruckMitr. Let me help you complete your driver onboarding.', timestamp: '10:05 AM' },
    { sender: 'lead', text: 'Ji, what documents do I need to send?', timestamp: '10:12 AM' },
    { sender: 'caller', text: 'Please send your DL and Aadhaar card images here.', timestamp: '10:14 AM' },
    { sender: 'lead', text: 'I am sending DL now.', timestamp: '10:20 AM' },
    { sender: 'lead', text: 'Thank you, I have uploaded my Driving License screenshot.', timestamp: '10:22 AM' },
  ];

  // Filtering Call Records
  const filteredCalls = calls.filter(c => {
    if (processFilter !== 'ALL' && c.process !== processFilter) return false;
    if (callerFilter !== 'ALL' && c.caller !== callerFilter) return false;
    if (outcomeFilter !== 'ALL' && c.outcome !== outcomeFilter) return false;
    if (selectedSources.length > 0 && !selectedSources.includes(c.leadSource || 'ORGANIC')) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        c.context.toLowerCase().includes(query) ||
        c.tmid.toLowerCase().includes(query) ||
        c.caller.toLowerCase().includes(query)
      );
    }
    return true;
  });

  // Filtering Chat Records
  const filteredChats = chats.filter(ch => {
    if (processFilter !== 'ALL' && ch.process !== processFilter) return false;
    if (callerFilter !== 'ALL' && ch.caller !== callerFilter) return false;
    if (selectedSources.length > 0 && !selectedSources.includes(ch.leadSource || 'ORGANIC')) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        ch.contactName.toLowerCase().includes(query) ||
        ch.tmid.toLowerCase().includes(query) ||
        ch.caller.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <main className="bg-background p-md space-y-lg text-xs font-sans max-w-[1440px] mx-auto relative min-h-[600px]">
      {/* Top Title & Navigation Tabs */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md border-b border-outline-variant pb-xs">
        <div>
          <h2 className="text-lg font-extrabold text-on-surface">Global Call & Chat Audit Log</h2>
          <p className="text-[10px] text-outline font-semibold">System-wide monitoring with zero scope boundaries</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border border-outline-variant rounded-sm overflow-hidden select-none">
          <button
            onClick={() => setActiveTab('CALL')}
            className={`px-md py-1.5 font-bold text-[11px] flex items-center gap-xs ${
              activeTab === 'CALL' ? 'bg-primary text-white' : 'bg-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            Call Recording Logs
          </button>
          <button
            onClick={() => setActiveTab('CHAT')}
            className={`px-md py-1.5 font-bold text-[11px] flex items-center gap-xs ${
              activeTab === 'CHAT' ? 'bg-primary text-white' : 'bg-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            WhatsApp Threads
          </button>
        </div>
      </section>

      {/* Shared Filter Bar */}
      <section className="bg-white p-sm border border-outline-variant rounded-sm flipkart-shadow grid grid-cols-1 sm:grid-cols-6 gap-sm items-center">
        <div>
          <label className="text-[9px] text-outline font-bold uppercase block mb-1">Process</label>
          <select
            value={processFilter}
            onChange={(e) => setProcessFilter(e.target.value)}
            className="w-full bg-white border border-outline-variant p-1.5 rounded-sm focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="ALL">All Processes</option>
            <option value="DW">Driver Welcome</option>
            <option value="TR">Transporter Welcome</option>
            <option value="MM">Matchmaking</option>
            <option value="SC">Special Categories</option>
          </select>
        </div>

        <div>
          <label className="text-[9px] text-outline font-bold uppercase block mb-1">Caller Agent</label>
          <select
            value={callerFilter}
            onChange={(e) => setCallerFilter(e.target.value)}
            className="w-full bg-white border border-outline-variant p-1.5 rounded-sm focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="ALL">All Callers (19)</option>
            <option value="Sonam">Sonam</option>
            <option value="Ankit Singh">Ankit Singh</option>
            <option value="Ravi">Ravi</option>
            <option value="Rohit K.">Rohit K.</option>
            <option value="Akash Thakur">Akash Thakur</option>
          </select>
        </div>

        <div>
          <label className="text-[9px] text-outline font-bold uppercase block mb-1">Outcome</label>
          <select
            value={outcomeFilter}
            onChange={(e) => setOutcomeFilter(e.target.value)}
            className="w-full bg-white border border-outline-variant p-1.5 rounded-sm focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="ALL">All Outcomes</option>
            <option value="Connected">Connected</option>
            <option value="NR">No Response</option>
            <option value="Busy">Busy</option>
            <option value="Converted">Converted</option>
          </select>
        </div>

        {/* Lead Source Multi-Select Filter */}
        <div className="relative">
          <label className="text-[9px] text-outline font-bold uppercase block mb-1">Lead Source</label>
          <button
            type="button"
            onClick={() => setShowSourceDropdown(!showSourceDropdown)}
            className="w-full bg-white border border-outline-variant p-1.5 rounded-sm focus:ring-1 focus:ring-primary outline-none text-left flex justify-between items-center text-[11px]"
          >
            <span className="truncate">
              {selectedSources.length === 0
                ? 'All Sources'
                : selectedSources.join(', ')}
            </span>
            <span className="material-symbols-outlined text-xs">arrow_drop_down</span>
          </button>
          
          {showSourceDropdown && (
            <div className="absolute left-0 right-0 mt-1 bg-white border border-outline-variant rounded-sm shadow-lg z-20 p-2 space-y-1 max-h-48 overflow-y-auto">
              {['ORGANIC', 'META ADS', 'GOOGLE ADS', 'INSTAGRAM', 'FACEBOOK', 'FB COMMENT', 'IG COMMENT', 'MANUAL'].map(src => {
                const checked = selectedSources.includes(src);
                return (
                  <label key={src} className="flex items-center gap-2 cursor-pointer hover:bg-surface-container-low p-1 rounded-sm select-none">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        if (checked) {
                          setSelectedSources(prev => prev.filter(s => s !== src));
                        } else {
                          setSelectedSources(prev => [...prev, src]);
                        }
                      }}
                      className="accent-primary"
                    />
                    <span className="font-semibold text-[10px]">{src}</span>
                  </label>
                );
              })}
              {selectedSources.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedSources([])}
                  className="w-full text-center text-primary text-[10px] font-bold border-t border-outline-variant pt-1.5 mt-1 hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>

        <div className="sm:col-span-2">
          <label className="text-[9px] text-outline font-bold uppercase block mb-1">Global Search</label>
          <input
            type="text"
            placeholder="Search by TMID, Lead Name, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-outline-variant p-1.5 rounded-sm focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </section>

      {/* Tab 1: Call Log */}
      {activeTab === 'CALL' && (
        <section className="bg-white border border-outline-variant rounded-sm flipkart-shadow overflow-hidden">
          <div className="px-md py-sm bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
            <span className="font-bold text-outline text-[10px] uppercase">Recordings database</span>
            <button className="text-primary font-bold hover:underline">Export call log (CSV)</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container text-outline text-[10px] uppercase font-extrabold border-b border-outline-variant">
                <tr>
                  <th className="px-md py-3 w-10"></th>
                  <th className="px-md py-3">Date/Time</th>
                  <th className="px-md py-3">Caller</th>
                  <th className="px-md py-3">Process</th>
                  <th className="px-md py-3">Lead / Context</th>
                  <th className="px-md py-3">Duration</th>
                  <th className="px-md py-3">Outcome</th>
                  <th className="px-md py-3">Disposition</th>
                  <th className="px-md py-3 text-center">QC Audited</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-medium text-on-surface">
                {filteredCalls.map(call => (
                  <React.Fragment key={call.id}>
                    <tr
                      onClick={() => setSelectedLead(call)}
                      className="hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      <td className="px-md py-3" onClick={(e) => e.stopPropagation()}>
                        {call.recordingUrl ? (
                          <button
                            onClick={() => setPlayingCallId(playingCallId === call.id ? null : call.id)}
                            className="material-symbols-outlined text-primary text-[18px] hover:scale-115 active:scale-95 transition-transform"
                          >
                            {playingCallId === call.id ? 'pause_circle' : 'play_circle'}
                          </button>
                        ) : (
                          <span className="material-symbols-outlined text-outline opacity-40 text-[18px]">block</span>
                        )}
                      </td>
                      <td className="px-md py-3 font-data-mono">{call.dateTime}</td>
                      <td className="px-md py-3 font-bold">{call.caller}</td>
                      <td className="px-md py-3">
                        <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-extrabold text-white ${
                          call.process === 'DW' ? 'bg-green-500' :
                          call.process === 'TR' ? 'bg-orange-500' :
                          call.process === 'MM' ? 'bg-purple-500' : 'bg-teal-500'
                        }`}>
                          {call.process}
                        </span>
                      </td>
                      <td className="px-md py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold">{call.context}</span>
                          {call.leadSource && call.leadSource !== 'ORGANIC' && (
                            <span className="bg-red-50 text-red-700 text-[8px] font-extrabold px-1 py-0.2 rounded border border-red-200">
                              {call.leadSource}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-outline font-data-mono">{call.tmid}</div>
                      </td>
                      <td className="px-md py-3 font-data-mono">{call.duration}</td>
                      <td className="px-md py-3">
                        <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-extrabold ${
                          call.outcome === 'Converted' ? 'bg-green-100 text-green-800' :
                          call.outcome === 'Connected' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {call.outcome}
                        </span>
                      </td>
                      <td className="px-md py-3 truncate max-w-[120px]" title={call.disposition}>
                        {call.disposition}
                      </td>
                      <td className="px-md py-3 text-center">
                        {call.qcAudited ? (
                          <span className="text-green-600 font-extrabold flex items-center justify-center gap-xs">
                            ✓ {call.qcScore}/100
                          </span>
                        ) : (
                          <span className="text-outline italic">—</span>
                        )}
                      </td>
                    </tr>
                    {/* Inline player drawer */}
                    {playingCallId === call.id && (
                      <tr>
                        <td colSpan={9} className="bg-primary/5 px-md py-sm border-b border-outline-variant">
                          <div className="flex items-center gap-md">
                            <span className="font-bold text-primary font-data-mono text-[10px]">INLINE AUDIO PLAYBACK:</span>
                            <audio src={call.recordingUrl} controls autoPlay className="h-8 max-w-md w-full" />
                            <button
                              onClick={() => setPlayingCallId(null)}
                              className="text-[10px] font-bold text-red-600 underline"
                            >
                              Close Player
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
                {filteredCalls.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center text-outline py-xl font-bold">No calls match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Tab 2: Chat Log */}
      {activeTab === 'CHAT' && (
        <section className="bg-white border border-outline-variant rounded-sm flipkart-shadow overflow-hidden">
          <div className="px-md py-sm bg-surface-container-low border-b border-outline-variant">
            <span className="font-bold text-outline text-[10px] uppercase">WhatsApp Conversation Archive</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container text-outline text-[10px] uppercase font-extrabold border-b border-outline-variant">
                <tr>
                  <th className="px-md py-3">Date</th>
                  <th className="px-md py-3">Caller</th>
                  <th className="px-md py-3">Process</th>
                  <th className="px-md py-3">Contact Name</th>
                  <th className="px-md py-3">TMID</th>
                  <th className="px-md py-3 w-96">Last Message</th>
                  <th className="px-md py-3 text-center">Msgs</th>
                  <th className="px-md py-3 text-right">Channel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-medium text-on-surface">
                {filteredChats.map(chat => (
                  <tr
                    key={chat.id}
                    onClick={() => setViewingChat(chat)}
                    className="hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    <td className="px-md py-3 font-data-mono">{chat.date}</td>
                    <td className="px-md py-3 font-bold">{chat.caller}</td>
                    <td className="px-md py-3">
                      <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-extrabold text-white ${
                        chat.process === 'DW' ? 'bg-green-500' :
                        chat.process === 'TR' ? 'bg-orange-500' :
                        chat.process === 'MM' ? 'bg-purple-500' : 'bg-teal-500'
                      }`}>
                        {chat.process}
                      </span>
                    </td>
                    <td className="px-md py-3">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span>{chat.contactName}</span>
                        {chat.leadSource && chat.leadSource !== 'ORGANIC' && (
                          <span className="bg-red-50 text-red-700 text-[8px] font-extrabold px-1 py-0.2 rounded border border-red-200">
                            {chat.leadSource}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-md py-3 font-data-mono text-outline">{chat.tmid}</td>
                    <td className="px-md py-3 truncate max-w-xs font-normal text-on-surface-variant">
                      {chat.lastMessage}
                    </td>
                    <td className="px-md py-3 text-center font-data-mono font-bold">{chat.messageCount}</td>
                    <td className="px-md py-3 text-right font-bold text-green-600">{chat.channel}</td>
                  </tr>
                ))}
                {filteredChats.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-outline py-xl font-bold">No chats match your filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Floating Read-Only Chat Modal */}
      {viewingChat && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-white border border-outline-variant flipkart-shadow rounded-sm flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary p-md text-white flex justify-between items-center select-none">
            <div>
              <h4 className="font-bold text-xs">{viewingChat.contactName}</h4>
              <p className="text-[10px] opacity-80">{viewingChat.tmid} · Thread Owner: {viewingChat.caller}</p>
            </div>
            <button
              onClick={() => setViewingChat(null)}
              className="material-symbols-outlined text-[18px] text-white hover:opacity-80"
            >
              close
            </button>
          </div>

          {/* Messages body */}
          <div className="flex-1 p-md space-y-sm overflow-y-auto bg-surface-container-lowest custom-scrollbar">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-sm rounded-sm text-xs ${
                  msg.sender === 'caller'
                    ? 'bg-primary/10 text-on-surface ml-auto border-l-2 border-primary'
                    : 'bg-surface-container text-on-surface border-l-2 border-outline'
                }`}
              >
                <p className="font-medium">{msg.text}</p>
                <span className="text-[8px] text-outline mt-xs block text-right font-data-mono">{msg.timestamp}</span>
              </div>
            ))}
          </div>

          {/* Footer: Read-only warning */}
          <div className="p-sm bg-surface-container border-t border-outline-variant text-center select-none">
            <p className="text-[10px] text-red-600 font-extrabold uppercase">
              ⚠ Viewing as Telecalling Head — read-only
            </p>
          </div>
        </div>
      )}

      {/* Lead Detail Slide-Out */}
      {selectedLead && (
        <div className="fixed inset-y-0 right-0 z-50 w-96 bg-white border-l border-outline-variant flipkart-shadow p-md flex flex-col justify-between">
          <div className="space-y-md">
            <div className="flex justify-between items-start border-b pb-xs border-outline-variant">
              <div>
                <h3 className="font-bold text-sm text-on-surface">{selectedLead.context}</h3>
                <p className="font-data-mono text-outline text-[10px]">{selectedLead.tmid}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="material-symbols-outlined text-outline hover:text-black"
              >
                close
              </button>
            </div>

            <div className="space-y-sm text-xs">
              <div className="grid grid-cols-2 py-xs border-b border-outline-variant/30">
                <span className="text-outline font-semibold">Agent Caller:</span>
                <span className="font-bold text-on-surface">{selectedLead.caller}</span>
              </div>
              <div className="grid grid-cols-2 py-xs border-b border-outline-variant/30">
                <span className="text-outline font-semibold">Process:</span>
                <span className="font-bold text-on-surface uppercase">{selectedLead.process}</span>
              </div>
              <div className="grid grid-cols-2 py-xs border-b border-outline-variant/30">
                <span className="text-outline font-semibold">Call Duration:</span>
                <span className="font-bold font-data-mono text-on-surface">{selectedLead.duration}</span>
              </div>
              <div className="grid grid-cols-2 py-xs border-b border-outline-variant/30">
                <span className="text-outline font-semibold">Outcome Status:</span>
                <span className="font-bold text-on-surface">{selectedLead.outcome}</span>
              </div>
              <div className="grid grid-cols-2 py-xs border-b border-outline-variant/30">
                <span className="text-outline font-semibold">Call Disposition:</span>
                <span className="font-bold text-on-surface">{selectedLead.disposition}</span>
              </div>
              <div className="py-xs">
                <span className="text-outline font-semibold block mb-1">Interaction Notes:</span>
                <p className="bg-surface-container-low p-sm rounded-sm font-medium text-on-surface-variant">
                  Lead requested callback tomorrow to confirm pricing. Indicated standard plans are too expensive but welcomed upsell options.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-md border-outline-variant select-none">
            <button
              onClick={() => setSelectedLead(null)}
              className="w-full bg-primary text-white py-sm font-bold rounded-sm uppercase tracking-wider hover:opacity-90 active:scale-98 transition-transform"
            >
              Close Detail Panel
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ThGlobalCallChatLog;
