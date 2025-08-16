import { createSlice } from '@reduxjs/toolkit';
import { fetchHRProfile } from "../Thunks/HRThunk.js";

const initialState = {
  hrUser: null,
  isLoading: false,
  error: null,
};

const hrProfileSlice = createSlice({
  name: 'hrProfile',
  initialState,
  reducers: {
    clearHRProfile: (state) => {
      state.hrUser = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHRProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHRProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hrUser = action.payload;
      })
      .addCase(fetchHRProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.hrUser = null;
      });
  },
});

export const { clearHRProfile } = hrProfileSlice.actions;
export default hrProfileSlice.reducer;