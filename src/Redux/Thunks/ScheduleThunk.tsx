import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../settings/axios";
import type { CreateScheduleModel, DisplayScheduleModel } from "../../Models/MainScheduleModels/MainScheduleModel";
import type { CreateScheduleTaskModel, ScheduleTaskModel } from "../../Models/ScheduleTaskModels/ScheduleTaskModel";
import { ActivateSchedule_api, AddScheduleTask_api, AssignTechnicianToScheduleTask_api, CreateSchedule_api, DeactivateSchedule_api, DeleteSchedule_api, DeleteScheduleTask_api, EditSchedule_api, EditScheduleTask_api, GetAllSchedules_api, GetAllSchedulesByEquipmentId_api, GetAllSortedByDates_api } from "../Api/ScheduleApis";
import type { RootState } from "../Store";


export const CreateNewSchedule = createAsyncThunk<DisplayScheduleModel, CreateScheduleModel>(
    "schedules/createNewSchedule",
    async (data, { rejectWithValue }) => {
        try 
        {
            
            const response = await CreateSchedule_api(data)
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
            var State = thunkAPI.getState() as RootState

            if(State.Schedule.ScheduleListWithTask.length > 0) return thunkAPI.rejectWithValue("Schedules already Loaded")

            const response = await GetAllSchedules_api()
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
            const response = await GetAllSchedulesByEquipmentId_api(Id)
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
                var State = thunkAPI.getState() as RootState

                if(State.Schedule.SortedSchedules.length > 0) return thunkAPI.rejectWithValue("Schedules already Loaded")

                const response = await GetAllSortedByDates_api()
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
                const response = await EditSchedule_api(data)
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
                const response = await DeleteSchedule_api(Id)
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
            const response = await ActivateSchedule_api(Id)
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
            const response = await DeactivateSchedule_api(Id)
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
            const response = await AddScheduleTask_api(ScheduleId, Task)
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
            const response = await DeleteScheduleTask_api(ScheduleId, TaskId)
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
                const response = await EditScheduleTask_api(ScheduleId, ScheduleTask1)
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
            const response = await AssignTechnicianToScheduleTask_api(ScheduleId, ScheduleTaskId, TechId)
            return response.data;
        }
        catch (error: any)
        {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)