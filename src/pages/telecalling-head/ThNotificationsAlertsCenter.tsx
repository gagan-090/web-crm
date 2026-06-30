import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetThNotificationsQuery } from '../../services/api/teleheadApi';
import { PageTableSkeleton } from '../../components/PageSkeleton';

export const ThNotificationsAlertsCenter: React.FC = () => {
  const navigate = useNavigate();
  const { data: notificationsData, isLoading } = useGetThNotificationsQuery();
  const notificationsList = notificationsData?.data ?? [];

  const [activeTab, setActiveTab] = useState<'All' | 'SLA Alerts' | 'Conversion' | 'QC Logs' | 'HR/Admin' | 'System'>('All');
  const [selectedId, setSelectedId] = useState<number | string | null>(null);

  // Helper to format time relative to today
  const formatTimeAgo = (dateStr: string) => {
    try {
      const diffMs = new Date().getTime() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return dateStr.split(' ')[0]; // YYYY-MM-DD
    } catch (e) {
      return 'Just now';
    }
  };

  const getNotificationStyles = (n: any) => {
    switch (n.type) {
      case 'critical':
      case 'error':
        return {
          icon: 'timer',
          iconColor: 'text-error',
          borderColor: 'border-l-error',
          badgeClass: 'bg-error-container text-on-error-container',
          badgeText: 'CRITICAL',
          leftIcon: 'warning',
          leftIconBg: 'bg-error/10 text-error'
        };
      case 'success':
        return {
          icon: 'trending_up',
          iconColor: 'text-secondary',
          borderColor: 'border-l-secondary',
          badgeClass: 'bg-secondary-fixed text-on-secondary-fixed-variant',
          badgeText: 'SUCCESS',
          leftIcon: 'trending_up',
          leftIconBg: 'bg-secondary/10 text-secondary'
        };
      case 'review':
        return {
          icon: 'fact_check',
          iconColor: 'text-primary',
          borderColor: 'border-l-primary',
          badgeClass: 'bg-primary-fixed text-on-primary-fixed-variant',
          badgeText: 'REVIEW',
          leftIcon: 'fact_check',
          leftIconBg: 'bg-primary/10 text-primary'
        };
      case 'admin':
        return {
          icon: 'person_alert',
          iconColor: 'text-tertiary',
          borderColor: 'border-l-tertiary',
          badgeClass: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
          badgeText: 'ADMIN',
          leftIcon: 'person_alert',
          leftIconBg: 'bg-tertiary/10 text-tertiary'
        };
      default:
        return {
          icon: 'dns',
          iconColor: 'text-outline',
          borderColor: 'border-l-outline',
          badgeClass: 'bg-surface-container-high text-on-surface-variant',
          badgeText: n.type?.toUpperCase() || 'SYSTEM',
          leftIcon: 'dns',
          leftIconBg: 'bg-outline/10 text-outline'
        };
    }
  };

  // All homepage alerts mapped as notifications
  const homepageAlertIds = ['campaign-sla', 'untagged', 'sla', 'backlog', 'hiring'];

  const homepageNotifications = homepageAlertIds.map((id: string) => {
    switch (id) {
      case 'campaign-sla':
        return {
          id: 'campaign-sla',
          title: 'SLA Alert',
          message: '🔥 SLA Alert: Hot Campaign Leads uncalled for > 1 hour!',
          type: 'critical',
          category: 'SLA',
          created_at: new Date().toISOString(),
          actionText: 'Assign & Nudge →',
          actionUrl: '/th/global-campaign-console'
        };
      case 'untagged':
        return {
          id: 'untagged',
          title: 'Untagged Calls Alert',
          message: '⚠ Calls untagged across all teams.',
          type: 'critical',
          category: 'SLA',
          created_at: new Date().toISOString(),
          actionText: 'View by Team →',
          actionUrl: '/th/team-monitor'
        };
      case 'sla':
        return {
          id: 'sla',
          title: 'Active SLA Breaches',
          message: '⚠ Active SLA breaches — Transporter first-call and Job SLA.',
          type: 'critical',
          category: 'SLA',
          created_at: new Date().toISOString(),
          actionText: 'View →',
          actionUrl: '/th/sla-dashboard'
        };
      case 'backlog':
        return {
          id: 'backlog',
          title: 'Backlog Alert',
          message: 'Uncalled leads in backlog.',
          type: 'admin',
          category: 'System',
          created_at: new Date().toISOString(),
          actionText: 'Launch Sprint →',
          actionUrl: '/th/backlog-campaign-manager'
        };
      case 'hiring':
        return {
          id: 'hiring',
          title: 'Critical Hiring Alert',
          message: '⚠ CRITICAL open roles unfilled beyond target hire week.',
          type: 'admin',
          category: 'HR',
          created_at: new Date().toISOString(),
          actionText: 'View Hiring →',
          actionUrl: '/hr/hiring-dashboard-live'
        };
      default:
        return null;
    }
  }).filter(Boolean);

  const combinedNotifications = [...homepageNotifications, ...notificationsList];

  // Filter based on active tab
  const filteredNotifications = combinedNotifications.filter((n: any) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'SLA Alerts') return n.category === 'SLA';
    if (activeTab === 'Conversion') return n.category === 'Conversion';
    if (activeTab === 'QC Logs') return n.category === 'QC Console';
    if (activeTab === 'HR/Admin') return n.category === 'HR';
    if (activeTab === 'System') return n.category === 'System';
    return true;
  });

  const activeNotification = filteredNotifications.find((n: any) => n.id === selectedId) || filteredNotifications[0];

  if (isLoading) {
    return <PageTableSkeleton rows={6} cols={4} title="Notifications & Alerts" />;
  }

  return (
    <main className="flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Notifications Feed */}
        <div className="w-1/2 border-r border-outline-variant flex flex-col bg-white">
          <div className="px-md pt-md bg-surface-container-lowest">
            <div className="flex items-center justify-between mb-md">
              <h2 className="font-headline-md text-headline-md font-bold">Notifications</h2>
              <div className="flex gap-xs">
                <button className="px-3 py-1 bg-primary text-on-primary text-[11px] font-bold rounded-sm active:scale-95 transition-transform">
                  Mark All as Read
                </button>
                <button className="px-2 py-1 border border-outline-variant text-on-surface-variant text-[11px] font-bold rounded-sm hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-[16px]">filter_list</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="relative flex gap-gutter border-b border-outline-variant overflow-x-auto no-scrollbar">
              {(['All', 'SLA Alerts', 'Conversion', 'QC Logs', 'HR/Admin', 'System'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSelectedId(null); // Reset detail preview on tab change
                  }}
                  className={`pb-2 px-1 font-label-caps text-label-caps whitespace-nowrap relative ${
                    activeTab === tab ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-md text-center text-outline font-semibold">Loading notifications...</div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-md text-center text-outline font-semibold">No notifications in this category.</div>
            ) : (
              filteredNotifications.map((n: any) => {
                const styles = getNotificationStyles(n);
                const isActive = activeNotification && activeNotification.id === n.id;
                return (
                  <div
                    key={n.id}
                    onClick={() => setSelectedId(n.id)}
                    className={`group border-b border-outline-variant transition-all cursor-pointer p-md relative border-l-4 ${styles.borderColor} ${
                      isActive ? 'bg-surface-container-high' : 'bg-surface-container-low/30 hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-[20px] ${styles.iconColor}`}>{styles.icon}</span>
                        <span className="font-bold text-[13px]">{n.title}</span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant">{formatTimeAgo(n.created_at)}</span>
                    </div>
                    <p className="text-on-surface-variant text-body-sm leading-tight line-clamp-2">{n.message}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`px-2 py-px text-[10px] font-bold rounded-sm ${styles.badgeClass}`}>{styles.badgeText}</span>
                      <span className="text-[10px] text-on-surface-variant">Category: {n.category || 'System'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Details View & Alert Preferences */}
        <div className="w-1/2 flex flex-col bg-surface-container-low">
          {activeNotification ? (
            <div className="p-lg bg-white border-b border-outline-variant">
              {(() => {
                const styles = getNotificationStyles(activeNotification);
                return (
                  <>
                    <div className="flex justify-between items-start mb-lg">
                      <div className="flex gap-md">
                        <div className={`w-12 h-12 rounded-sm flex items-center justify-center ${styles.leftIconBg}`}>
                          <span className="material-symbols-outlined text-[32px]">{styles.leftIcon}</span>
                        </div>
                        <div>
                          <h3 className="font-headline-md text-headline-md font-bold mb-1">{activeNotification.title}</h3>
                          <div className="flex items-center gap-2 text-on-surface-variant text-[12px]">
                            <span className="font-bold">From: WebCRM Core</span>
                            <span>•</span>
                            <span>{new Date(activeNotification.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 border border-outline-variant rounded-sm hover:bg-surface-container transition-colors">
                          <span className="material-symbols-outlined text-[20px]">archive</span>
                        </button>
                        <button className="p-2 border border-outline-variant rounded-sm hover:bg-surface-container transition-colors">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </div>
                    <div className="prose prose-sm max-w-none text-on-surface-variant mb-lg">
                      <p className="mb-4 font-semibold text-[13px]">{activeNotification.message}</p>
                      
                      {activeNotification.category === 'SLA' && (
                        <div className="grid grid-cols-2 gap-md p-md bg-surface-container-low rounded-sm border border-outline-variant mb-4">
                          <div>
                            <p className="text-[10px] uppercase font-bold text-outline">Notification ID</p>
                            <p className="font-bold">#NT-{activeNotification.id}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-outline">Category</p>
                            <p className="font-bold">SLA Breach</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-outline">Time Recorded</p>
                            <p>{activeNotification.created_at}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-bold text-outline">Priority Level</p>
                            <p className="text-error font-bold">CRITICAL</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-md">
                      {activeNotification.actionUrl ? (
                        <button
                          onClick={() => navigate(activeNotification.actionUrl)}
                          className="flex-grow bg-[#2874F0] hover:bg-[#1b5cb8] text-white py-2 font-bold rounded-sm active:scale-[0.98] transition-all text-center"
                        >
                          {activeNotification.actionText || 'Go to Action'}
                        </button>
                      ) : (
                        <>
                          <button className="flex-grow bg-[#2874F0] text-white py-2 font-bold rounded-sm active:scale-[0.98] transition-transform">
                            Acknowledge Alert
                          </button>
                          <button className="flex-grow bg-[#FB641B] text-white py-2 font-bold rounded-sm active:scale-[0.98] transition-transform">
                            Escalate
                          </button>
                        </>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="p-lg bg-white border-b border-outline-variant text-center text-outline">
              Select a notification to view details.
            </div>
          )}

          {/* Preferences */}
          <div className="flex-1 p-lg overflow-y-auto custom-scrollbar">
            <h3 className="font-label-caps text-label-caps font-bold mb-md text-primary">Alert Preferences</h3>
            <p className="text-[12px] text-on-surface-variant mb-lg">
              Configure how you receive critical system updates and operational alerts.
            </p>
            <div className="space-y-gutter">
              <div className="bg-white p-md border border-outline-variant flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-error">alarm</span>
                  <div>
                    <p className="font-bold text-[13px]">SLA Breach Alerts</p>
                    <p className="text-[11px] text-on-surface-variant">Immediate notification for any team delay.</p>
                  </div>
                </div>
                <div className="flex gap-xl">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] uppercase font-bold text-outline">Push</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked className="sr-only peer" type="checkbox" />
                      <div className="w-8 h-4 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] uppercase font-bold text-outline">Email</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked className="sr-only peer" type="checkbox" />
                      <div className="w-8 h-4 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white p-md border border-outline-variant flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">query_stats</span>
                  <div>
                    <p className="font-bold text-[13px]">Conversion Milestones</p>
                    <p className="text-[11px] text-on-surface-variant">Periodic updates on team performance targets.</p>
                  </div>
                </div>
                <div className="flex gap-xl">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] uppercase font-bold text-outline">Push</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked className="sr-only peer" type="checkbox" />
                      <div className="w-8 h-4 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] uppercase font-bold text-outline">Email</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input className="sr-only peer" type="checkbox" />
                      <div className="w-8 h-4 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-lg flex justify-end">
              <button className="bg-[#2874F0] text-white px-md py-2 font-bold rounded-sm active:scale-[0.98] transition-transform">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThNotificationsAlertsCenter;
