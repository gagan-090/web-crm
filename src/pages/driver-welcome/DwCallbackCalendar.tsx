import React from 'react';
import MasterCallbackCalendar from '../../shared/components/business/MasterCallbackCalendar';
import {
  useGetDwCallbacksQuery,
  useGetDwLeadDetailQuery,
  useScheduleDwCallbackMutation,
  useUpdateDwCallbackMutation,
  useDeleteDwCallbackMutation,
} from '../../services/api/webCrmApi';

// Driver-Welcome callback calendar — the shared master cockpit wired to the
// DW (driver) own-scope endpoints.
export const DwCallbackCalendar: React.FC = () => (
  <MasterCallbackCalendar
    roleLabel="DRIVER"
    useCallbacksQuery={useGetDwCallbacksQuery}
    useLeadDetailQuery={useGetDwLeadDetailQuery}
    useScheduleMutation={useScheduleDwCallbackMutation}
    useUpdateMutation={useUpdateDwCallbackMutation}
    useDeleteMutation={useDeleteDwCallbackMutation}
  />
);

export default DwCallbackCalendar;
