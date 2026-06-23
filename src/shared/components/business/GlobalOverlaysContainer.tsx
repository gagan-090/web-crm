import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGlobalOverlays } from '../../context/GlobalOverlaysContext';
import { GlobalWhatsAppModal } from './GlobalWhatsAppModal';
import { GlobalCallingKeypadModal } from './GlobalCallingKeypadModal';
import { useClickToCall } from '../../hooks/useClickToCall';

export const GlobalOverlaysContainer: React.FC = () => {
  const location = useLocation();
  const { activeChats, callingState, minimizeWhatsApp, openWhatsApp } = useGlobalOverlays();
  const { triggerCall } = useClickToCall();

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // 1. Handle tel links
      const telLink = target.closest('a[href^="tel:"]');
      if (telLink) {
        e.preventDefault();
        const href = telLink.getAttribute('href') || '';
        const phone = href.replace('tel:', '').trim();
        const name = telLink.getAttribute('data-lead-name') || telLink.textContent?.trim() || 'Outbound Lead';
        const tmid = telLink.getAttribute('data-tmid') || telLink.getAttribute('data-lead-id') || 'LD-' + Math.floor(1000 + Math.random() * 9000);
        const contextLine = telLink.getAttribute('data-context') || undefined;
        triggerCall(name, phone, 'Outbound Call', tmid, contextLine);
        return;
      }

      // 2. Handle class-based callable numbers
      const callableElem = target.closest('.callable-number');
      if (callableElem) {
        const phone = callableElem.textContent?.trim() || '';
        const name = callableElem.getAttribute('data-lead-name') || 'Outbound Lead';
        const tmid = callableElem.getAttribute('data-tmid') || 'LD-' + Math.floor(1000 + Math.random() * 9000);
        const contextLine = callableElem.getAttribute('data-context') || undefined;
        triggerCall(name, phone, 'Outbound Call', tmid, contextLine);
        return;
      }

      // 3. Handle WhatsApp triggers
      const whatsappBtn = target.closest('.whatsapp-btn, .whatsapp-link, [data-whatsapp], button[title*="WhatsApp"], button[title*="whatsapp"]');
      if (whatsappBtn) {
        e.preventDefault();
        const name = whatsappBtn.getAttribute('data-lead-name') || whatsappBtn.getAttribute('data-name') || 'Outbound Lead';
        const phone = whatsappBtn.getAttribute('data-phone') || whatsappBtn.getAttribute('data-lead-phone') || '+91 99999 88888';
        const tmid = whatsappBtn.getAttribute('data-tmid') || whatsappBtn.getAttribute('data-driver-id') || 'DR-88888';
        
        // Detect role from path context
        const path = window.location.pathname;
        let role = 'th';
        if (path.startsWith('/dw')) role = 'dw';
        else if (path.startsWith('/wct')) role = 'wct';
        else if (path.startsWith('/mm')) role = 'mm';
        else if (path.startsWith('/sc')) role = 'sc';

        openWhatsApp(name, phone, tmid, role);
        return;
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [triggerCall, openWhatsApp]);

  // Redundancy rule: check if the page itself has an active call layout
  const isEmbeddedCallPage = 
    location.pathname.includes('active-call') || 
    location.pathname.includes('live-console');

  const expandedChats = activeChats.filter(chat => !chat.isMinimized);
  const minimizedChats = activeChats.filter(chat => chat.isMinimized);

  return (
    <div className="global-overlays-container fixed inset-0 pointer-events-none select-none z-50">
      {/* 1. Expanded WhatsApp Chats (staggered slightly to make them easily draggable apart) */}
      <div className="pointer-events-auto">
        {expandedChats.map((chat, idx) => (
          <div 
            key={chat.id} 
            style={{ 
              zIndex: 50 + idx,
              position: 'fixed',
              bottom: `${24 + idx * 16}px`,
              right: `${24 + idx * 16}px`,
            }}
            className="pointer-events-auto"
          >
            <GlobalWhatsAppModal chat={chat} />
          </div>
        ))}
      </div>

      {/* 2. Minimized WhatsApp Pills (stacked vertically at bottom-right) */}
      {minimizedChats.length > 0 && (
        <div 
          className="fixed bottom-6 right-6 flex flex-col items-end gap-2.5 z-40 pointer-events-auto select-none"
          style={{
            // Keep stack positioned next to/below calling keypad if active
            transform: callingState.isOpen && !isEmbeddedCallPage ? 'translateX(-340px)' : 'none',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {minimizedChats.map(chat => {
            const unreadCount = chat.messages.filter(m => m.sender === 'lead').length;
            return (
              <button
                key={chat.id}
                onClick={() => minimizeWhatsApp(chat.id, false)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg border border-white flex items-center gap-2 cursor-pointer transition-all active:scale-95 text-xs font-bold hover:scale-105"
              >
                <span className="material-symbols-outlined text-sm text-white">chat_bubble</span>
                <span>{chat.name}</span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Calling Keypad Modal (redundancy-protected) */}
      {callingState.isOpen && !isEmbeddedCallPage && (
        <div className="pointer-events-auto z-50">
          <GlobalCallingKeypadModal />
        </div>
      )}


    </div>
  );
};

export default GlobalOverlaysContainer;
