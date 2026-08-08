import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import FloatingDialer from '../shared/components/business/FloatingDialer';
import { useClickToCall } from '../shared/hooks/useClickToCall';
import { useGlobalOverlays } from '../shared/context/GlobalOverlaysContext';
import { useAuth } from '../app/providers/AuthProvider';
import { Role } from '../shared/constants/roles';
import { SanCtiProvider, CallControlBar, PostCallDispositionModal, TollFreeNotifier, useSanCti } from '../shared/components/cti';
import DriverBankNotifier from '../shared/components/DriverBankNotifier';
import ConversionConfirmationToast from '../shared/components/incentive/ConversionConfirmationToast';
import FullscreenGuard from '../shared/components/FullscreenGuard';
import PageTransition from '../shared/components/PageTransition';
import useCrmTheme from '../shared/theme/useCrmTheme';
import FestiveCorners from '../shared/components/FestiveCorners';

/**
 * Festive decoration is a DASHBOARD-ONLY treatment.
 *
 * On a dashboard the corner art sits in empty space and reads as celebration;
 * on a working screen — the call queue, a lead table, the disposition gate — it
 * lands on top of the buttons an agent is trying to hit all day (the fireworks
 * sat squarely over "Add to Bank"). Work screens stay clean; only the landing
 * dashboards get dressed up.
 */
const isDashboardRoute = (pathname: string) =>
  /dashboard$/.test(pathname) || /overview$/.test(pathname);

// Navigates to the active call focus screen when an incoming call rings OR connects.
// Must be rendered inside SanCtiProvider.
function IncomingCallNavigator({ user }: { user: any }) {
  const { callState, isIncomingCall, currentLeadId } = useSanCti();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isActiveIncoming =
      isIncomingCall &&
      (callState === 'incoming_ringing' || callState === 'connected');

    if (isActiveIncoming) {
      const alreadyOnFocusPage = location.pathname.includes('active-call-focus');
      if (!alreadyOnFocusPage) {
        const isWct = user?.role?.includes('WCT') || user?.role?.includes('Transporter');
        const targetPath = isWct ? '/wct/wct-active-call-focus' : '/dw/dw-active-call-focus';
        navigate(targetPath, {
          state: { incomingCall: true, userId: currentLeadId || '' },
          replace: false,
        });
      }
    }
  }, [callState, isIncomingCall, currentLeadId, location.pathname, navigate, user]);

  return null;
}

export const DashboardLayout: React.FC = () => {
  const { isTricolor: IS_TRICOLOR_THEME, showDashboardDecor } = useCrmTheme();
  const { triggerCall } = useClickToCall();
  const { openWhatsApp } = useGlobalOverlays();
  const { user } = useAuth();

  const routeLocation = useLocation();
  const showDecor = isDashboardRoute(routeLocation.pathname);

  const isThDrilldown = user?.role === Role.TH && window.location.pathname.startsWith('/tl/');
  const isCtiRole = user?.role === Role.DW || user?.role === Role.WCT || user?.role === Role.MM || user?.role === Role.SC;

  // Collapsible sidebar (persisted). Hiding it reclaims the full width for the
  // work area — useful on the wide call-history / queue tables.
  const [sidebarHidden, setSidebarHidden] = useState<boolean>(() => {
    try { return localStorage.getItem('crm_sidebar_hidden') === '1'; } catch { return false; }
  });
  const toggleSidebar = () => setSidebarHidden((prev) => {
    const next = !prev;
    try { localStorage.setItem('crm_sidebar_hidden', next ? '1' : '0'); } catch { /* ignore */ }
    return next;
  });

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
        
        // Find if data-lead-id or similar is available
        const leadId = telLink.getAttribute('data-lead-id') || 'LD-' + Math.floor(1000 + Math.random() * 9000);
        triggerCall(name, phone, undefined, leadId);
        return;
      }

      // 2. Handle class-based callable numbers
      const callableElem = target.closest('.callable-number');
      if (callableElem) {
        const phone = callableElem.textContent?.trim() || '';
        const name = callableElem.getAttribute('data-lead-name') || 'Outbound Lead';
        const leadId = callableElem.getAttribute('data-lead-id') || 'LD-' + Math.floor(1000 + Math.random() * 9000);
        triggerCall(name, phone, undefined, leadId);
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

  const handleDispositionComplete = (result: any) => {
    // Dispatch global event for Active Call Focus screens to refresh and load next lead
    window.dispatchEvent(new CustomEvent('san-disposition-complete', { detail: result }));
  };

  const layoutContent = (
    <div 
      className={`h-screen w-screen overflow-hidden relative ${IS_TRICOLOR_THEME ? 'bg-[#F8FAFC]' : 'bg-background'}`}
      style={IS_TRICOLOR_THEME ? {
        backgroundImage: `radial-gradient(circle at 10% 10%, rgba(255, 153, 51, 0.08) 0%, transparent 40%), radial-gradient(circle at 90% 10%, rgba(19, 136, 8, 0.08) 0%, transparent 40%), linear-gradient(135deg, #F8FAFC 0%, #FAFBFD 100%)`,
      } : undefined}
    >
      {/* Sidebar Navigation */}
      <Sidebar hidden={sidebarHidden} />

      {/* Main Top Header */}
      <Topbar sidebarHidden={sidebarHidden} onToggleSidebar={toggleSidebar} />

      {/* ── Independence Day decoration — dashboards only, and always BEHIND the
             content (z-0). Corner-anchored so it frames the screen instead of
             covering it. ── */}
      {IS_TRICOLOR_THEME && showDecor && showDashboardDecor && <FestiveCorners />}

      {/* Main View Area Wrapper */}
      <div
        className={`absolute right-0 bottom-0 z-10 overflow-y-auto overflow-x-hidden p-md transition-all duration-300 ${
          IS_TRICOLOR_THEME ? 'bg-transparent' : 'bg-background'
        } ${
          sidebarHidden ? 'left-0' : 'left-[240px]'
        } ${isThDrilldown ? 'top-[96px]' : 'top-[56px]'}`}
      >
        {isThDrilldown && (
          <div className={`fixed top-[56px] ${sidebarHidden ? 'left-0' : 'left-[240px]'} right-0 h-10 bg-amber-500 text-white flex items-center justify-between px-md font-bold text-xs z-30 select-none shadow-sm`}>
            <span>Viewing as Telecalling Head — Team Leader's Dashboard View</span>
            <button
              onClick={() => window.location.href = '/th/main-overview-dashboard'}
              className="bg-white text-amber-700 px-sm py-1 rounded-sm font-extrabold uppercase hover:bg-amber-50 active:scale-95 transition-transform"
            >
              Exit to Command Center
            </button>
          </div>
        )}
        <PageTransition>
          <Outlet />
        </PageTransition>
      </div>

      {/* Global Floating Dialer */}
      <FloatingDialer />

      {/* CTI Floating Elements */}
      {isCtiRole && (
        <>
          <CallControlBar />
          <PostCallDispositionModal onDispositionComplete={handleDispositionComplete} />
          {/* "A new driver was banked" — renders only for matchmaking callers,
              wherever they happen to be working. */}
          <DriverBankNotifier />
          <TollFreeNotifier />
        </>
      )}

      {/* Incentive Engine — Global Conversion Toast (all roles) */}
      <ConversionConfirmationToast />

      {/* Strict proctored-exam-style fullscreen enforcement — Driver Welcome
          callers only. The whole workspace is blocked unless the browser is
          in fullscreen; exiting (Esc included) re-blocks instantly. */}
      {user?.role === Role.DW && <FullscreenGuard processLabel="Driver Welcome Calling" />}
    </div>
  );

  if (isCtiRole) {
    return (
      <SanCtiProvider>
        <IncomingCallNavigator user={user} />
        {layoutContent}
      </SanCtiProvider>
    );
  }

  return layoutContent;
};
export default DashboardLayout;
