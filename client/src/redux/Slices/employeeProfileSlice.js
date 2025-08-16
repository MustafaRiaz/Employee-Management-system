import { createSlice } from '@reduxjs/toolkit';
import { HandlePostEmployees, fetchEmployeeProfile } from "../Thunks/EmployeeThunk"

const initialState = {
  employeeUser: null,
  isLoading: false,
  error: null,
};

const employeeProfileSlice = createSlice({
  name: 'employeeProfile',
  initialState,
  reducers: {
    clearEmployeeProfile: (state) => {
      state.employeeUser = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.employeeUser = action.payload;
      })
      .addCase(fetchEmployeeProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.employeeUser = null;
      });
  },
});

export const { clearEmployeeProfile } = employeeProfileSlice.actions;
export default employeeProfileSlice.reducer;