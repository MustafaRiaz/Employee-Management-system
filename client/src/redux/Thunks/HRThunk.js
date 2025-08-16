import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../apis/apiService";
import { HREndPoints } from "../apis/APIsEndpoints";

export const HandleGetHumanResources = createAsyncThunk("HandleGetHumanResources", async (HRData, { rejectWithValue }) => {
    try {
        const { apiroute } = HRData;
        const response = await apiService.get(`${HREndPoints[apiroute]}`, {
            withCredentials: true
        });
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const fetchHRProfile = createAsyncThunk(
    "hrProfile/fetchHRProfile",
    async (_, { rejectWithValue }) => {
        try {
            // Use the correct full URL here
            const response = await apiService.get('/api/v1/HR/me', {
                withCredentials: true
            });
            // The API response returns an object with a 'data' key
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const HandlePostHumanResources = createAsyncThunk("HandlePostHumanResources", async (HRData, { rejectWithValue }) => {
    try {
        const { apiroute, data, type } = HRData
        if (type == "resetpassword") {
            const response = await apiService.post(`${HREndPoints.RESET_PASSWORD(apiroute)}`, data, { 
                withCredentials: true
            })
            return response.data
        }
        else {
            const response = await apiService.post(`${HREndPoints[apiroute]}`, data, {
                withCredentials: true
            })
            return response.data 
        }
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
})

export const HandlePutHumanResources = createAsyncThunk("HandlePutHumanResources", async (HRData, { rejectWithValue }) => { })

export const HandlePatchHumanResources = createAsyncThunk("HandlePutHumanResources", async (HRData, { rejectWithValue }) => { })

export const HandleDeleteHumanResources = createAsyncThunk("HandlePutHumanResources", async (HRData, { rejectWithValue }) => { })