import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import FloatingDialer from '../shared/components/business/FloatingDialer';
import { useClickToCall } from '../shared/hooks/useClickToCall';
import { useGlobalOverlays } from '../shared/context/GlobalOverlaysContext';

export const DashboardLayout: React.FC = () => {
  const { triggerCall } = useClickToCall();
  const { openWhatsApp } = useGlobalOverlays();

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
        triggerCall(name, phone);
        return;
      }

      // 2. Handle class-based callable numbers
      const callableElem = target.closest('.callable-number');
      if (callableElem) {
        const phone = callableElem.textContent?.trim() || '';
        const name = callableElem.getAttribute('data-lead-name') || 'Outbound Lead';
        triggerCall(name, phone);
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

  return (
    <div className="h-screen w-screen overflow-hidden bg-background relative">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Top Header */}
      <Topbar />

      {/* Main View Area Wrapper */}
      <div className="absolute top-[56px] left-[240px] right-0 bottom-0 overflow-y-auto overflow-x-hidden p-md bg-background">
        <Outlet />
      </div>

      {/* Global Floating Dialer */}
      <FloatingDialer />
    </div>
  );
};
export default DashboardLayout;
