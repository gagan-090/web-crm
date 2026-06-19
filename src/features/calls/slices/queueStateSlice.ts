import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface DialerLead {
  id: string;
  name: string;
  phone: string;
  process: string;
  status: string;
}

interface QueueState {
  activeLead: DialerLead | null;
  callStatus: 'idle' | 'dialing' | 'connected' | 'wrapup';
  isMuted: boolean;
  secondsElapsed: number;
}

const initialState: QueueState = {
  activeLead: null,
  callStatus: 'idle',
  isMuted: false,
  secondsElapsed: 0,
};

const queueStateSlice = createSlice({
  name: 'queueState',
  initialState,
  reducers: {
    setActiveDialerLead: (state, action: PayloadAction<DialerLead | null>) => {
      state.activeLead = action.payload;
      if (action.payload === null) {
        state.callStatus = 'idle';
        state.secondsElapsed = 0;
      }
    },
    setCallStatus: (state, action: PayloadAction<QueueState['callStatus']>) => {
      state.callStatus = action.payload;
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    tickTimer: (state) => {
      state.secondsElapsed += 1;
    },
    resetTimer: (state) => {
      state.secondsElapsed = 0;
    }
  }
});

export const { setActiveDialerLead, setCallStatus, toggleMute, tickTimer, resetTimer } = queueStateSlice.actions;
export default queueStateSlice.reducer;
