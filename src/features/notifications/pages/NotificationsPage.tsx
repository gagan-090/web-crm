import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../../app/rootReducer';
import {
  markAsRead,
  markAllAsRead,
  clearNotifications
} from '../slices/notificationsSlice';

export const NotificationsPage: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.notifications.items);
  const [filter, setFilter] = useState<'ALL' | 'warning' | 'error' | 'info'>('ALL');

  const filteredItems = notifications.filter(
    item => filter === 'ALL' || item.type === filter
  );

  return (
    <div className="space-y-md">
      {/* Alert Controls Panel */}
      <section className="bg-white p-md border border-outline-variant rounded-sm flipkart-shadow flex items-center justify-between">
        {/* Filtering Tabs */}
        <div className="flex gap-sm text-xs">
          {[
            { id: 'ALL', label: 'All Alerts' },
            { id: 'warning', label: 'Warnings' },
            { id: 'error', label: 'Fatal Errors' },
            { id: 'info', label: 'System Logs' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id as any)}
              className={`px-sm py-1 border rounded-sm font-semibold transition-all ${
                filter === item.id
                  ? 'bg-primary-fixed text-primary border-primary font-bold'
                  : 'border-outline-variant hover:bg-surface-container bg-white text-on-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Global actions */}
        <div className="flex gap-sm">
          <button
            onClick={() => dispatch(markAllAsRead())}
            className="px-sm py-1 border border-outline-variant rounded-sm hover:bg-surface-container-low text-xs font-bold bg-white text-on-surface"
          >
            Mark All Read
          </button>
          <button
            onClick={() => dispatch(clearNotifications())}
            className="px-sm py-1 bg-error text-white text-xs font-bold rounded-sm hover:bg-red-700"
          >
            Clear All
          </button>
        </div>
      </section>

      {/* Notifications feed list */}
      <div className="bg-white border border-outline-variant rounded-sm p-md flipkart-shadow space-y-md">
        <h3 className="font-headline-md text-xs font-extrabold uppercase text-on-surface">
          System Alerts & Critical Notifications Feed
        </h3>

        <div className="space-y-sm">
          {filteredItems.length === 0 ? (
            <div className="text-center py-lg text-outline font-semibold text-xs bg-surface-container-low rounded-sm border border-outline-variant">
              No alerts in this category.
            </div>
          ) : (
            filteredItems.map((n) => {
              const borderStyles = {
                warning: 'border-l-4 border-amber-500 bg-amber-500/10',
                error: 'border-l-4 border-error bg-error-container/30',
                info: 'border-l-4 border-primary bg-primary-fixed/20',
                success: 'border-l-4 border-green-500 bg-green-500/10'
              };

              return (
                <div
                  key={n.id}
                  onClick={() => dispatch(markAsRead(n.id))}
                  className={`p-sm border border-outline-variant rounded-sm flex items-center justify-between gap-md cursor-pointer transition-all hover:border-primary ${
                    borderStyles[n.type]
                  } ${!n.read ? 'font-semibold' : 'opacity-80'}`}
                >
                  <div className="flex items-center gap-md">
                    <span className="material-symbols-outlined text-[20px]">
                      {n.type === 'error' ? 'report' : n.type === 'warning' ? 'warning' : 'info'}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">{n.title}</h4>
                      <p className="text-xs text-on-surface-variant mt-xs">{n.message}</p>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <span className="font-data-mono text-outline text-[10px] block">{n.timestamp}</span>
                    {!n.read && (
                      <span className="inline-block mt-xs w-2 h-2 rounded-full bg-primary" title="Unread alert"></span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
export default NotificationsPage;
