import { baseApi } from './baseApi';

export interface CtiFeedbackPayload {
  id: number;
  call_status: string;
  call_feedback: string;
  call_remarks?: string;
  call_recording?: File; // optional audio file
}

export interface CtiFeedbackResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    call_status: string;
    updated_at: string;
  };
}

export interface InitiateIvrCallPayload {
  user_id?: number | null;
  user_name?: string | null;
  user_mobile?: string | null;
  user_tm_id?: string | null;
  assigned_to: number;
  assigned_name: string;
  assigned_number: string;
  did_number: string;
  process: string;
  call_type?: string | null;
}

export interface InitiateIvrCallResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    assigned_to: number;
    user_id?: number;
    user_tm_id?: string;
  };
}

export const ctiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    initiateIvrCall: builder.mutation<InitiateIvrCallResponse, InitiateIvrCallPayload>({
      query: (payload) => ({
        url: '/tmapp/welcome-calling/ivr-call-initiated',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Calls'],
    }),
    submitCtiFeedback: builder.mutation<CtiFeedbackResponse, CtiFeedbackPayload>({
      query: (payload) => {
        // Since we may have a call_recording File upload, use FormData if file exists
        if (payload.call_recording) {
          const formData = new FormData();
          formData.append('id', payload.id.toString());
          formData.append('call_status', payload.call_status);
          formData.append('call_feedback', payload.call_feedback);
          if (payload.call_remarks) {
            formData.append('call_remarks', payload.call_remarks);
          }
          formData.append('call_recording', payload.call_recording);

          return {
            url: '/tmapp/welcome-calling/cti-feedback-submit',
            method: 'POST',
            body: formData,
            // fetchBaseQuery automatically handles boundary headers if body is FormData
          };
        }

        // Standard JSON request if no file is uploaded
        return {
          url: '/tmapp/welcome-calling/cti-feedback-submit',
          method: 'POST',
          body: {
            id: payload.id,
            call_status: payload.call_status,
            call_feedback: payload.call_feedback,
            call_remarks: payload.call_remarks,
          },
        };
      },
      invalidatesTags: ['Calls', 'Callbacks'],
    }),
  }),
});

export const { useInitiateIvrCallMutation, useSubmitCtiFeedbackMutation } = ctiApi;
export default ctiApi;

