import { createAsyncThunk } from "@reduxjs/toolkit";
import type { TaskLog } from "../../Models/TaskModels/TaskLogModel";
import { CreateTaskLog_api, DeleteTaskLog_api, GetAllTaskLog_api, UpdateTaskLog_api } from "../Api/TaskLogApis";



export const GetAllTaskLogs = createAsyncThunk<TaskLog[], number>(
    "taskLogs/getAllTaskLogs",
    async (taskId: number, thunkAPI) => 
    {
        try 
        {
            const response = await GetAllTaskLog_api(taskId);
            return response.data;
            
        } 
        catch (error : any) 
        {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const CreateTaskLog = createAsyncThunk<TaskLog,{taskId: number, note: string}>(
    "taskLogs/createTaskLog",
    async (taskLogData: {taskId: number, note: string}, thunkAPI) =>
        {
            try 
            {
                const response = await CreateTaskLog_api(taskLogData)
                return response.data;
            } 
            catch (error : any) 
            {
                    return thunkAPI.rejectWithValue(error.message);
            }
        }
)

export const UpdateTaskLog = createAsyncThunk<TaskLog,{logId: number, note:string}>(
    "taskLogs/updateTaskLog",
    async (taskLogData, thunkAPI) =>
        {
            try
            {
                const userName = localStorage.getItem("Name");
                const Log :TaskLog =
                {
                    logId:taskLogData.logId,
                    note: taskLogData.note,
                    createdAt: new Date().toISOString(),
                    createdBy: userName ?? "Unknown",
                    attachments: []
                }

               const response = await UpdateTaskLog_api(Log)
               return response.data;
            }
            catch (error : any)
            {
                return thunkAPI.rejectWithValue(error.message);
            }
        }
)

export const DeleteTaskLog = createAsyncThunk<TaskLog, number>(
    "taskLogs/deleteTaskLog",
    async (logId: number, thunkAPI) =>
    {
        try
        {
            const response = await DeleteTaskLog_api(logId)
            return response.data;
        }
        catch (error : any)
        {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)