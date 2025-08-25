import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../settings/axios";
import { DeleteHistory_api, EditHistory_api, GetAllHistory_api, GetHistoryById_api, CreateMaintenanceHistory_api, GetAllCount_Api } from "../Api/MaintenanceHistoryApis";
import type MaintenanceHistory from "../../Models/HistoryModels/HistoryModel";

export const GetAllCount = createAsyncThunk<number[]>(
    "history/getAllCounts",
    async(_, thunkAPI) =>
    {
        try
        {
            const response = await GetAllCount_Api()
            return response.data;
        }
        catch (error: any)
        {
            return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch Count")
        }
    }
)

export const GetAllHistory = createAsyncThunk<MaintenanceHistory[]>(
  'history/getAll',
  async (_, thunkAPI) =>
  {
    try 
    {
      const response = await GetAllHistory_api();
      return response.data;
    } 
    catch (error: any) 
    {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch history');
    }
  }
);

export const GetHistoryByEquipmentId = createAsyncThunk<MaintenanceHistory[], number>(
    'history/getByEquipmentId',
    async (equipmentId: number, thunkAPI) => 
        {
            try
            {
             const response = await GetHistoryById_api(equipmentId);
             return response.data;
            } 
            catch (error: any) 
            {
             return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch history by equipment id');
            }
        }
)

export const CreateMaintenanceHistory = createAsyncThunk<MaintenanceHistory, {
    equipmentId: number;
    equipmentName: string;
    equipmentType: string;
    startDate: string;
    endDate: string;
}>(
    'history/create',
    async (maintenanceHistory, thunkAPI) => 
        {
            try
            {
             const response = await CreateMaintenanceHistory_api(maintenanceHistory);
             return response.data;
            } 
            catch (error: any) 
            {
             return thunkAPI.rejectWithValue(error.response?.data || 'Failed to create maintenance history');
            }
        }
)

export const DeleteMaintenanceHistory = createAsyncThunk<void ,number>(
    'history/delete',
    async (historyId: number, thunkAPI) =>
        {
            try
            {
                const response = await DeleteHistory_api(historyId);
            }
            catch (error: any)
            {
                return thunkAPI.rejectWithValue(error.response?.data || 'Failed to delete maintenance history');
            }
       }
)

export const EditMaintenanceHistory = createAsyncThunk<MaintenanceHistory ,MaintenanceHistory>(
    'history/edit',
    async (history: MaintenanceHistory, thunkAPI) =>
        {
            try
            {
             const response = await EditHistory_api(history)
             return response.data;
            }
            catch (error: any)
            {
                return thunkAPI.rejectWithValue(error.response?.data || 'Failed to edit maintenance history');
            }
        }
    )