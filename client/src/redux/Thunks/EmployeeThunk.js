import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiService } from '../apis/apiService'
import { APIsEndPoints } from '../apis/APIsEndpoints.js'


export const HandleGetEmployees = createAsyncThunk("handleGetEmployees", async (EmployeeData, { rejectWithValue }) => {
    try {
        const { apiroute } = EmployeeData
        const response = await apiService.get(`${APIsEndPoints[apiroute]}`, { 
            withCredentials: true
        })
        return response.data
    } catch (error) { 
        return rejectWithValue(error.response.data);
    }
})

export const fetchEmployeeProfile = createAsyncThunk(
  "employeeProfile/fetchEmployeeProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/api/v1/employee/by-employee', {
        withCredentials: true,
      });
      // The API response returns an object with a 'data' key
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const employeeLogout = createAsyncThunk(
  "employee/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Adjust the endpoint based on your backend's logout route
      const response = await apiService.post('/api/v1/employee/logout', {}, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Logout failed" });
    }
  }
);


export const HandlePostEmployees = createAsyncThunk("HandlePostEmployees", async (EmployeeData, { rejectWithValue }) => {
    try {
        const { apiroute, data, type } = EmployeeData
        if (type == "resetpassword") {
            const response = await apiService.post(`${APIsEndPoints.RESET_PASSWORD(apiroute)}`, data, {
                withCredentials: true
            })
            return response.data
        }
        else {
            const response = await apiService.post(`${APIsEndPoints[apiroute]}`, data, {
                withCredentials: true
            })
            return response.data
        }
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const HandlePutEmployees = createAsyncThunk()

export const HandlePatchEmployees = createAsyncThunk()

export const HandleDeleteEmployees = createAsyncThunk()
