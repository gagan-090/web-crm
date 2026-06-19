import { baseApi } from './baseApi';

export interface ClickToCallPayload {
  leadId: string;
  phone: string;
  role: string;
}

export interface ClickToCallResponse {
  success: boolean;
  message: string;
  callSid: string;
  gateway: string;
}

export const clickToCallApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    initiateCall: builder.mutation<ClickToCallResponse, ClickToCallPayload>({
      query: (payload) => ({
        url: '/calls/click-to-call',
        method: 'POST',
        body: payload
      })
    })
  })
});

export const { useInitiateCallMutation } = clickToCallApi;
export default clickToCallApi;
