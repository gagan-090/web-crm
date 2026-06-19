import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface LeadFiltersState {
  search: string;
  status: string;
  process: string;
  priority: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const initialState: LeadFiltersState = {
  search: '',
  status: 'ALL',
  process: 'ALL',
  priority: 'ALL',
  page: 1,
  limit: 10,
  sortBy: 'created_at',
  sortOrder: 'desc',
};

const leadFiltersSlice = createSlice({
  name: 'leadFilters',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1; // Reset page on search
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.status = action.payload;
      state.page = 1;
    },
    setProcessFilter: (state, action: PayloadAction<string>) => {
      state.process = action.payload;
      state.page = 1;
    },
    setPriorityFilter: (state, action: PayloadAction<string>) => {
      state.priority = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1;
    },
    setSorting: (state, action: PayloadAction<{ sortBy: string; sortOrder: 'asc' | 'desc' }>) => {
      state.sortBy = action.payload.sortBy;
      state.sortOrder = action.payload.sortOrder;
    },
    resetFilters: () => initialState,
  },
});

export const {
  setSearch,
  setStatusFilter,
  setProcessFilter,
  setPriorityFilter,
  setPage,
  setLimit,
  setSorting,
  resetFilters,
} = leadFiltersSlice.actions;
export default leadFiltersSlice.reducer;
