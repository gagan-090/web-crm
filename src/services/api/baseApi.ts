import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../shared/constants/config';
import { forceLogout } from '../../features/auth/session/forceLogout';

// Setup Laravel Sanctum / JWT base API
const rawBaseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    // Never serve API responses from the browser's HTTP disk cache. Without
    // this, a GET whose URL previously returned something cacheable (e.g. the
    // SPA index.html a server sent before an endpoint existed) can be replayed
    // "200 OK (from disk cache)" — RTK Query then receives HTML instead of
    // JSON and the screen renders empty. no-store forces every request to the
    // network, which is what you want for an authenticated, always-fresh API.
    cache: 'no-store',
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
});

// Wrap the base query so a superseded single-session token (401
// SESSION_SUPERSEDED) signs this device out cleanly the moment ANY data call
// hits it — not just the heartbeat. Other 401s are left for callers to handle.
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const code = (result.error.data as { code?: string } | undefined)?.code;
    if (code === 'SESSION_SUPERSEDED') {
      forceLogout('superseded');
    }
  }
  return result;
};

// Setup Laravel Sanctum / JWT base API
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
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
    'Settings',
    'DriverBank',
    'MmJobs',
    'MmApplicants',
    'MmTransporter',
    'MmConnectionRequest',
    'TlBoard',
    'WebRoles',
    'CrmThemes',
    'IdVerification',
    'Revival',
    'HotLeads',
    'Notes'
  ],
  endpoints: () => ({}), // Endpoints will be injected by domain features
});
