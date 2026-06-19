import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
}

interface NotificationsState {
  items: NotificationItem[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  items: [
    {
      id: '1',
      title: 'SLA Breach Warning',
      message: 'Lead DW-4013 has breached the 10-minute callback timer.',
      type: 'warning',
      timestamp: '2 mins ago',
      read: false
    },
    {
      id: '2',
      title: 'New Matching Candidate',
      message: 'A driver profile matching Job #784 has registered.',
      type: 'info',
      timestamp: '15 mins ago',
      read: false
    },
    {
      id: '3',
      title: 'Fatal QC Alert',
      message: 'Calibration failed for Call #9802. Please review fatal error log.',
      type: 'error',
      timestamp: '1 hour ago',
      read: true
    }
  ],
  unreadCount: 2
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<NotificationItem, 'id' | 'read' | 'timestamp'>>) => {
      const newItem: NotificationItem = {
        ...action.payload,
        id: Math.random().toString(),
        read: false,
        timestamp: 'Just now'
      };
      state.items.unshift(newItem);
      state.unreadCount += 1;
    },
    markAllAsRead: (state) => {
      state.items.forEach(item => { item.read = true; });
      state.unreadCount = 0;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item && !item.read) {
        item.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    }
  }
});

export const { addNotification, markAllAsRead, markAsRead, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
