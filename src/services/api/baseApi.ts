import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../shared/constants/config';

// Setup Laravel Sanctum / JWT base API
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      // Pull auth token from localStorage if present
      const storedUser = localStorage.getItem('tm_connect_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          // Standard authorization header
          if (parsed.token) {
            headers.set('authorization', `Bearer ${parsed.token}`);
          }
        } catch (e) {
          // ignore parsing error
        }
      }
      headers.set('accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: [
    'Leads',
    'Calls',
    'Callbacks',
    'QCQueue',
    'QCFeedback',
    'Hiring',
    'Attendance',
    'Payroll',
    'SprintItems',
    'Notifications',
    'Settings'
  ],
  endpoints: () => ({}), // Endpoints will be injected by domain features
});
