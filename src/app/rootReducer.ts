import { combineReducers } from '@reduxjs/toolkit';
import { baseApi } from '../services/api/baseApi';
import authReducer from '../features/auth/slices/authSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';
import notificationsReducer from '../features/notifications/slices/notificationsSlice';
import leadFiltersReducer from '../features/leads/slices/leadFiltersSlice';
import queueStateReducer from '../features/calls/slices/queueStateSlice';
import attendanceReducer from '../features/hr/slices/attendanceSlice';
import settingsReducer from '../features/settings/slices/settingsSlice';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  user: userReducer,
  ui: uiReducer,
  notifications: notificationsReducer,
  leadFilters: leadFiltersReducer,
  queueState: queueStateReducer,
  attendance: attendanceReducer,
  settings: settingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
