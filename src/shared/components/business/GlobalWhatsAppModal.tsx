import React, { useState, useEffect, useRef } from 'react';
import { useGlobalOverlays } from '../../context/GlobalOverlaysContext';
import type { WhatsAppChat } from '../../context/GlobalOverlaysContext';

interface GlobalWhatsAppModalProps {
  chat: WhatsAppChat;
}

const ROLE_TEMPLATES: Record<string, { label: string; text: string }[]> = {
  dw: [
    { label: 'Payment Link', text: 'Hi {name}, here is the link to complete your TruckMitr payment of Rs. 1,999: https://tm.in/pay/{tmid}' },
    { label: 'App Download', text: 'Dear {name}, download the TruckMitr Driver App here to start accepting high-paying trips: https://tm.in/app' },
    { label: 'Plan Brochure', text: 'Hello, here is the official TruckMitr Driver Benefits brochure detailing all plans: https://tm.in/brochure' },
    { label: 'Callback Confirmation', text: 'Dear {name}, as discussed, we have scheduled a callback for you. Talk to you soon!' },
  ],
  wct: [
    { label: 'Payment Link', text: 'Hi {name}, here is the payment link for your Premium plan subscription: https://tm.in/pay/{tmid}' },
    { label: 'App Download', text: 'Dear Transporter, download the TruckMitr Transporter App here: https://tm.in/app-tr' },
    { label: 'Plan Brochure', text: 'Hello, here is the TruckMitr Premium & Super Premium plans comparison brochure: https://tm.in/brochure-tr' },
    { label: 'Callback Confirmation', text: 'Dear Transporter, we have scheduled your callback. Thank you!' },
    { label: 'First Visit', text: 'Hi {name}, we look forward to onboarding your fleet. Our agent will visit you soon.' },
  ],
  mm: [
    { label: 'Job Description', text: 'Hello {name}, here is the job details for the route. HMV Driver required, Salary: 35k. Apply: https://tm.in/job/{tmid}' },
    { label: '3-Way Intro', text: 'Welcome! This is the 3-Way Intro Group between {name} and Sharma Logistics for route Delhi-Mumbai.' },
    { label: 'Joining Confirmation', text: 'Congratulations {name}! Your joining date is confirmed. Report at 10 AM tomorrow.' },
  ],
  sc: [
    { label: 'Income Model Explainer', text: 'Dear Partner, here is the detail of our commission models. Earn up to 25k per month.' },
    { label: 'Payment Link', text: 'Hi {name}, complete your security deposit here: https://tm.in/pay/{tmid}' },
  ],
  th: [
    { label: 'Reminder', text: 'Hi, please complete your pending SLA call queues by 6 PM today.' },
    { label: 'Policy Update', text: 'Team, please note the updated onboarding verification guidelines here: https://tm.in/policy' },
  ],
  tl: [
    { label: 'Reminder', text: 'Hi, please complete your pending SLA call queues by 6 PM today.' },
    { label: 'Policy Update', text: 'Team, please note the updated onboarding verification guidelines here: https://tm.in/policy' },
  ],
  hr: [
    { label: 'Reminder', text: 'Hi, please complete your pending SLA call queues by 6 PM today.' },
    { label: 'Policy Update', text: 'Team, please note the updated onboarding verification guidelines here: https://tm.in/policy' },
  ],
};

export const GlobalWhatsAppModal: React.FC<GlobalWhatsAppModalProps> = ({ chat }) => {
  const { closeWhatsApp, minimizeWhatsApp, sendWhatsAppMessage } = useGlobalOverlays();
  
  const [inputText, setInputText] = useState('');
  const [isSmsFallback, setIsSmsFallback] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<{ label: string; text: string } | null>(null);
  const [editableTemplateText, setEditableTemplateText] = useState('');

  // Dragging states
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return; // ignore buttons
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      // Calculate new position
      let newX = e.clientX - dragStartRef.current.x;
      let newY = e.clientY - dragStartRef.current.y;

      // Keep overlays within screen bounds roughly
      newX = Math.max(-window.innerWidth + 200, Math.min(newX, 100));
      newY = Math.max(-window.innerHeight + 100, Math.min(newY, 100));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const templates = ROLE_TEMPLATES[chat.roleContext.toLowerCase()] || [];

  const handleTemplateClick = (tpl: { label: string; text: string }) => {
    const filledText = tpl.text
      .replace(/{name}/g, chat.name)
      .replace(/{tmid}/g, chat.tmid || 'N/A');
    setActiveTemplate(tpl);
    setEditableTemplateText(filledText);
  };

  const handleSendFreeText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    sendWhatsAppMessage(chat.id, inputText.trim());
    setInputText('');
  };

  const handleSendTemplate = () => {
    if (!editableTemplateText.trim()) return;
    
    sendWhatsAppMessage(chat.id, editableTemplateText.trim(), activeTemplate?.label);
    setActiveTemplate(null);
    setEditableTemplateText('');
  };

  // Masked phone number representation
  const maskPhone = (phone: string) => {
    const cleaned = phone.replace(/\s+/g, '');
    if (cleaned.length >= 10) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 5)}XXX XXXXX`;
    }
    return phone;
  };

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        bottom: '24px',
        right: '24px',
      }}
      className="fixed w-[380px] h-[520px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden z-50 transition-shadow select-text border border-gray-200"
    >
      {/* Header bar */}
      <div
        onMouseDown={handleHeaderMouseDown}
        style={{ backgroundColor: isSmsFallback ? '#5D6D7E' : '#25D366' }}
        className="h-14 px-3 flex justify-between items-center text-white cursor-move select-none shrink-0"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-extrabold text-sm uppercase">
            {chat.name.slice(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-xs truncate max-w-[130px]">{chat.name}</span>
              {chat.tmid && (
                <span className="bg-black/25 font-mono text-[9px] px-1 rounded font-bold uppercase">
                  {chat.tmid}
                </span>
              )}
            </div>
            <p className="text-[10px] opacity-85 font-mono font-semibold">
              {isSmsFallback ? 'SMS Mode' : 'WhatsApp'} · {maskPhone(chat.phone)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-white">
          <button
            onClick={() => minimizeWhatsApp(chat.id, true)}
            className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded transition-colors text-white"
            title="Minimize"
          >
            <span className="material-symbols-outlined text-base">remove</span>
          </button>
          <button
            onClick={() => closeWhatsApp(chat.id)}
            className="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded transition-colors text-white"
            title="Close"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      </div>

      {/* Message canvas */}
      <div 
        style={{ backgroundColor: '#ECE5DD' }}
        className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col relative"
      >
        {chat.messages.map(msg => (
          <div
            key={msg.id}
            className={`max-w-[80%] rounded-lg p-2.5 shadow-sm text-xs relative group ${
              msg.sender === 'caller' 
                ? 'self-end bg-[#DCF8C6] text-gray-800 rounded-tr-none' 
                : 'self-start bg-white text-gray-800 rounded-tl-none'
            }`}
          >
            {msg.templateLabel && (
              <span className="block text-[8px] text-gray-400 font-extrabold uppercase mb-0.5 tracking-wider">
                Template: {msg.templateLabel}
              </span>
            )}
            
            <p className="whitespace-pre-wrap leading-normal font-medium">{msg.text}</p>
            
            <div className="flex justify-end items-center gap-0.5 mt-1 text-[9px] text-gray-400 select-none">
              <span>{msg.timestamp}</span>
              {msg.sender === 'caller' && (
                <span 
                  className={`material-symbols-outlined text-[11px] ${
                    msg.status === 'read' ? 'text-blue-500 font-bold' : 'text-gray-400'
                  }`}
                >
                  done_all
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Template Quick Preview Overlays */}
      {activeTemplate && (
        <div className="absolute bottom-[60px] left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg z-25 text-xs animate-slide-up flex flex-col gap-2">
          <div className="flex justify-between items-center pb-1 border-b border-gray-100 select-none">
            <span className="font-bold text-gray-700">Preview: {activeTemplate.label}</span>
            <button 
              onClick={() => setActiveTemplate(null)}
              className="text-gray-400 hover:text-gray-600 font-bold text-sm"
            >
              ×
            </button>
          </div>
          <textarea
            value={editableTemplateText}
            onChange={(e) => setEditableTemplateText(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded p-2 text-xs text-gray-700 outline-none focus:border-green-500 resize-none font-semibold"
          />
          <div className="flex justify-end gap-2 select-none">
            <button
              onClick={() => setActiveTemplate(null)}
              className="px-2.5 py-1 text-gray-500 border border-gray-200 rounded font-bold hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSendTemplate}
              style={{ backgroundColor: isSmsFallback ? '#5D6D7E' : '#25D366' }}
              className="px-3.5 py-1 text-white rounded font-bold hover:brightness-95 flex items-center gap-1 shadow-sm"
            >
              <span className="material-symbols-outlined text-xs">send</span>
              <span>Send Template</span>
            </button>
          </div>
        </div>
      )}

      {/* Pinned templates & Input dock */}
      <div className="shrink-0 bg-gray-50 border-t border-gray-200">
        
        {/* Templates selector */}
        <div className="px-3 py-2 flex gap-1.5 overflow-x-auto select-none border-b border-gray-150 scrollbar-none">
          {templates.map((tpl, i) => (
            <button
              key={i}
              onClick={() => handleTemplateClick(tpl)}
              className="shrink-0 bg-white border border-gray-200 hover:border-green-400 text-gray-600 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shadow-sm flex items-center gap-1 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[12px] text-green-500">chat_bubble_outline</span>
              {tpl.label}
            </button>
          ))}
        </div>

        {/* SMS fallback line */}
        <div className="px-3 py-1 flex justify-between items-center text-[10px] select-none font-bold text-gray-400 bg-white">
          <span>{isSmsFallback ? 'Send message via SMS' : 'Active WhatsApp Chat'}</span>
          <button
            onClick={() => setIsSmsFallback(!isSmsFallback)}
            className="text-purple-650 hover:underline hover:text-purple-800 flex items-center gap-0.5"
          >
            <span className="material-symbols-outlined text-[12px]">cell_tower</span>
            {isSmsFallback ? 'Use WhatsApp instead' : 'No WhatsApp — Send SMS instead'}
          </button>
        </div>

        {/* Typing dock */}
        <form onSubmit={handleSendFreeText} className="p-2.5 bg-gray-50 flex gap-2 items-center select-none">
          <button
            type="button"
            disabled
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-500 cursor-not-allowed"
            title="Attach File (disabled)"
          >
            <span className="material-symbols-outlined text-lg">attach_file</span>
          </button>
          
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-white border border-gray-250 rounded-full px-4 py-1.5 outline-none focus:border-green-500 text-xs font-semibold text-gray-700 shadow-inner"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            style={{ 
              backgroundColor: !inputText.trim() ? '#d1d5db' : (isSmsFallback ? '#5D6D7E' : '#25D366'),
              cursor: !inputText.trim() ? 'not-allowed' : 'pointer'
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow transition-all active:scale-90"
            title="Send"
          >
            <span className="material-symbols-outlined text-base">send</span>
          </button>
        </form>

      </div>
    </div>
  );
};
