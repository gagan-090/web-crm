import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AttendanceState {
  selectedMonth: string;
  selectedRoleFilter: string;
  searchQuery: string;
}

const initialState: AttendanceState = {
  selectedMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
  selectedRoleFilter: 'ALL',
  searchQuery: '',
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setAttendanceMonth: (state, action: PayloadAction<string>) => {
      state.selectedMonth = action.payload;
    },
    setAttendanceRoleFilter: (state, action: PayloadAction<string>) => {
      state.selectedRoleFilter = action.payload;
    },
    setAttendanceSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetAttendanceFilters: () => initialState
  }
});

export const {
  setAttendanceMonth,
  setAttendanceRoleFilter,
  setAttendanceSearchQuery,
  resetAttendanceFilters
} = attendanceSlice.actions;
export default attendanceSlice.reducer;
