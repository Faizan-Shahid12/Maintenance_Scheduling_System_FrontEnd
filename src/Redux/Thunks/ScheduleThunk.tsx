import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../settings/axios";
import type { CreateScheduleModel, DisplayScheduleModel } from "../../Models/MainScheduleModels/MainScheduleModel";
import type { CreateScheduleTaskModel, ScheduleTaskModel } from "../../Models/ScheduleTaskModels/ScheduleTaskModel";


export const CreateNewSchedule = createAsyncThunk<DisplayScheduleModel, CreateScheduleModel>(
    "schedules/createNewSchedule",
    async (data, { rejectWithValue }) => {
        try 
        {
            
            const response = await api.post("/MaintenanceSchedule/CreateMaintenanceSchedule", data);
            return response.data;
        }
        catch (error : any) 
        {
            return rejectWithValue(error.message);
        }
    }
)

export const GetAllSchedules = createAsyncThunk<DisplayScheduleModel[]>(
    'Schedule/getAllSchedules',
    async (_, thunkAPI) =>
    {
        try 
        {
            const response = await api.get("/MaintenanceSchedule/GetAllMaintenanceSchedules")
            return response.data;
        }
        catch (error: any)
        {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const GetAllSchedulesByEquipmentId = createAsyncThunk<DisplayScheduleModel[], number>(
    'Schedule/getAllByEquipmentId',
    async (Id, thunkAPI) =>
    {
        try
        {
            const response = await api.get("/MaintenanceSchedule/GetAllMaintenanceSchedulesByEquipmentId?EquipId=" + Id)
            return response.data;
        }
        catch (error: any)
        {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const GetAllSortedByDates = createAsyncThunk<DisplayScheduleModel[]>(
    'Schedule/getAllSortedByDates',
    async (_, thunkAPI) =>
        {
            try
            {
                const response = await api.get("/MaintenanceSchedule/GetAllSortedByStartDate")
                return response.data;
            }
            catch (error: any)
            {
                return thunkAPI.rejectWithValue(error.message);
            }
        }
)

export const EditSchedule = createAsyncThunk<DisplayScheduleModel,DisplayScheduleModel>(
    'Schedule/editSchedule',
    async (data, thunkAPI) =>
        {
            try
            {
                const response = await api.put("/MaintenanceSchedule/UpdateMaintenanceSchedule", data)
                return response.data;
            }
            catch (error: any)
            {
                return thunkAPI.rejectWithValue(error.message);
            }
        }
)

export const DeleteSchedule = createAsyncThunk<DisplayScheduleModel, number>(
    'Schedule/deleteSchedule',
    async (Id, thunkAPI) =>
        {
            try
            {
                const response = await api.delete("/MaintenanceSchedule/DeleteMaintenanceSchedule?ScheduleId=" + Id)
                return response.data;
            }
            catch (error: any)
            {
                return thunkAPI.rejectWithValue(error.message);
            }
        }
)

export const ActivateSchedule = createAsyncThunk<DisplayScheduleModel, number>(
    'Schedule/activateSchedule',
    async (Id, thunkAPI) =>
    {
        try
        {
            const response = await api.put("/MaintenanceSchedule/ActivateSchedule?ScheduleId=" + Id)
            return response.data;
        }
        catch (error: any)
        {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const DeactivateSchedule = createAsyncThunk<DisplayScheduleModel, number>(
    'Schedule/DeActivateSchedule',
    async (Id, thunkAPI) =>
    {
        try
        {
            const response = await api.put("/MaintenanceSchedule/UnActivateSchedule?ScheduleId=" + Id)
            return response.data;
        }
        catch (error: any)
        {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const AddScheduleTask = createAsyncThunk<DisplayScheduleModel, {ScheduleId : number, Task: CreateScheduleTaskModel}>(
    'Schedule/addScheduleTask',
    async ({ScheduleId, Task}, thunkAPI) =>
    {
        try
        {
            const response = await api.post("/MaintenanceSchedule/AddNewTaskToSchedule?ScheduleId=" + ScheduleId, Task)
            return response.data;
        }
        catch (error: any)
        {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const DeleteScheduleTask = createAsyncThunk<DisplayScheduleModel, {ScheduleId : number, TaskId : number}>(
    'Schedule/deleteScheduleTask',
    async ({ScheduleId, TaskId}, thunkAPI) =>
    {
        try
        {
            const response = await api.delete("/MaintenanceSchedule/DeleteTaskFromSchedule?ScheduleId=" + ScheduleId + "&&TaskId=" + TaskId)
            return response.data;
        }
        catch (error: any)
        {
            return thunkAPI.rejectWithValue(error.message);
        }

    }
)

export const EditScheduleTask = createAsyncThunk<DisplayScheduleModel, {ScheduleId: number, ScheduleTask1: ScheduleTaskModel}>(
    'Schedule/EditScheduleTask',
    async ({ScheduleId, ScheduleTask1}, thunkAPI) =>
        {
            try
            {
                const response = await api.put("/MaintenanceSchedule/EditScheduleTask?ScheduleId=" + ScheduleId, ScheduleTask1)
                    return response.data;
            }
            catch (error: any)
            {
                return thunkAPI.rejectWithValue(error.message);
            }
        }
)

export const AssignTechnicianToScheduleTask = createAsyncThunk<DisplayScheduleModel, {ScheduleId: number, ScheduleTaskId: number, TechId: string}>(
    'Schedule/AssignTechnicianToScheduleTask',
    async ({ScheduleId, ScheduleTaskId, TechId}, thunkAPI) =>
    {
        try
        {
            const response = await api.put("/MaintenanceSchedule/AssignTechnicianToScheduleTask?ScheduleId="+ ScheduleId + "&ScheduleTaskId=" + ScheduleTaskId + "&TechId=" + TechId)
            return response.data;
        }
        catch (error: any)
        {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)