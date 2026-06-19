import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  dailyCallTarget: number;
  dailyCallCount: number;
  breakStatus: 'active' | 'none';
}

const initialState: UserState = {
  dailyCallTarget: 100,
  dailyCallCount: 0,
  breakStatus: 'none',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    incrementCallCount: (state) => {
      state.dailyCallCount += 1;
    },
    setCallCount: (state, action: PayloadAction<number>) => {
      state.dailyCallCount = action.payload;
    },
    setDailyTarget: (state, action: PayloadAction<number>) => {
      state.dailyCallTarget = action.payload;
    },
    setBreakStatus: (state, action: PayloadAction<'active' | 'none'>) => {
      state.breakStatus = action.payload;
    },
  },
});

export const { incrementCallCount, setCallCount, setDailyTarget, setBreakStatus } = userSlice.actions;
export default userSlice.reducer;
