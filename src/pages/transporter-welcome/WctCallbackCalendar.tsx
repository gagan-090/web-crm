import React from 'react';
import MasterCallbackCalendar from '../../shared/components/business/MasterCallbackCalendar';
import {
  useGetWctCallbacksQuery,
  useGetWctLeadDetailQuery,
  useScheduleWctCallbackMutation,
  useUpdateWctCallbackMutation,
  useDeleteWctCallbackMutation,
} from '../../services/api/webCrmApi';

// Transporter-Welcome callback calendar — the shared master cockpit wired to
// the WCT (transporter) own-scope endpoints. Replaces the earlier static mock.
export const WctCallbackCalendar: React.FC = () => (
  <MasterCallbackCalendar
    roleLabel="TRANSPORTER"
    useCallbacksQuery={useGetWctCallbacksQuery}
    useLeadDetailQuery={useGetWctLeadDetailQuery}
    useScheduleMutation={useScheduleWctCallbackMutation}
    useUpdateMutation={useUpdateWctCallbackMutation}
    useDeleteMutation={useDeleteWctCallbackMutation}
  />
);

export default WctCallbackCalendar;
