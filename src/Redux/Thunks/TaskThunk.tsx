import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Task } from "../../Models/TaskModels/TaskModel";
import api from "../../settings/axios";
import { AddMainTask_api, AssignTechnician_api_1, AssignTechnician_api_2, CompleteTask_api, DeleteTask_api, GetAllTask_api, GetTaskByEquipmentId_api, GetTaskByHistoryId_api, UpdateTask_api } from "../Api/TaskApis";
import type { CreateTaskModel } from "../../Models/TaskModels/CreateTaskModel";
import type { RootState } from "../Store";


export const GetAllTask = createAsyncThunk<Task[]>(
    'task/getAll',
    async (_, thunkAPI) =>
    {
        try 
        {
            const response = await GetAllTask_api()
            return response.data;
        }
        catch (error: any)
        {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const GetTaskByEquipId = createAsyncThunk<Task[],number>(
    'task/getByEquipId',
    async (equipId, thunkAPI) =>
        {
            try
            {
                const response = await GetTaskByEquipmentId_api(equipId);
                return response.data;
            }
            catch (error: any)
            {
                return thunkAPI.rejectWithValue(error.message);
            }
        }
)

export const GetTaskByHistoryId = createAsyncThunk<Task[],number>(
    'task/getByHistoryId',
    async (historyId, thunkAPI) =>
        {
            try
            {
                const response = await GetTaskByHistoryId_api(historyId);
                return response.data;
            }
            catch (error: any)
            {
                return thunkAPI.rejectWithValue(error.message);
            }
        }
)

export const GetAllOverDueTasks = createAsyncThunk<Task[]>(
    'task/getAllOverDue',
    async (_, thunkAPI) =>
        {
            try
            {
                const response = await api.get("/MainTask/GetAllOverDueTasks");
                return response.data;
            }
            catch (error: any)
            {
                return thunkAPI.rejectWithValue(error.message);
            }
        }
)

export const GetCompletedTask = createAsyncThunk<Task[]>(
    'task/getCompletedTask',
    async (_, thunkAPI) =>
        {
            try
            {
                const response = await api.get("/MainTask/GetCompletedTask");
                return response.data;
            }
            catch (error: any)
            {
                return thunkAPI.rejectWithValue(error.message);
            }
        }
)

export const AddMainTask = createAsyncThunk<Task,CreateTaskModel>(
    'task/addMainTask',
    async (task, thunkAPI) =>
        {
            try
            {
                const response = await AddMainTask_api(task);
                let task1 : Task = response.data;

                if (task.technicianId != null)
                {

                    thunkAPI.dispatch(AssignTechnician({ taskId: task1.taskId, TechId: task.technicianId }));

                    const state = thunkAPI.getState() as RootState;
                    const tech = state.Technicians.TechOptions.filter(t => t.id === task.technicianId);
                    task1.assignedTo = tech.filter(t => t.id == task.technicianId)[0].fullName;
                }

                return task1

            }
            catch (error: any)
            {
                return thunkAPI.rejectWithValue(error.message);
            }
        }
)
export const UpdateMainTask = createAsyncThunk<Task,{ task: Task; OldTechId: string; NewTechId: string }>(
  'task/updateMainTask',
  async ({ task, OldTechId, NewTechId }, thunkAPI) => 
    {
        try 
        {
        const response = await UpdateTask_api(task);
        let task1: Task = response.data;

        if (NewTechId !== OldTechId) 
        {
            
            if(NewTechId != "")
            {
                const state = thunkAPI.getState() as RootState;
                const tech = state.Technicians.TechOptions;
                task1.assignedTo = tech.filter(t => t.id == NewTechId)[0].fullName?? "N/A";
            }
            else
            {
                task1.assignedTo = "N/A";
            }thunkAPI.dispatch(AssignTechnician({ taskId: task1.taskId, TechId: NewTechId }));

        }

        return task1;
        } 
        catch (error: any)
        {
            console.log(error.message);
            return thunkAPI.rejectWithValue(error.message);
        }
  }
);

export const DeleteMainTask = createAsyncThunk<Task,Task>(
    'task/deleteMainTask',
     async (task, thunkAPI) =>
     {
        try
        {
            const response = await DeleteTask_api(task)
            return response.data;
        }
        catch (error: any)
        {
            return thunkAPI.rejectWithValue(error.message);
        }
     }
)

export const UpdatePriority = createAsyncThunk<Task, Task>(
  'task/updatePriority',
  async (task, thunkAPI) =>
  {
    try
    {
      const response = await api.patch(
        "/MainTask/UpdatePriority?TaskId=" + task.taskId + "&Priority=" + task.priority
      );
      return response.data;
    }
    catch (error: any)
    {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
)


export const UpdateStatus = createAsyncThunk<Task, Task>(
  'task/updateStatus',
  async (task, thunkAPI) =>
  {
    try
    {
      const response = await api.patch("/MainTask/UpdateStatus?TaskId=" + task.taskId + "&Status=" + task.status);
      return response.data;
    }
    catch (error: any)
    {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
)

export const CompleteTask = createAsyncThunk<Task,Task>(
    'task/completeTask',
    async (task,thunkAPI) =>
        {
            try
            {
                const response = await CompleteTask_api(task)
                return response.data;
            }
            catch (error: any)
            {
                return thunkAPI.rejectWithValue(error.message);
            }
        }
)

export const AssignTechnician = createAsyncThunk<Task, { taskId: number, TechId: string }>(
    'task/assignTechnician',
    async (task, thunkAPI) =>
        {
            try
            {
                if(task.TechId !== "")
                {
                    const response = await AssignTechnician_api_1(task.taskId,task.TechId)
                    return response.data;
                }
                else if (task.TechId === "")
                {
                    const response = await AssignTechnician_api_2(task.taskId)
                    return response.data;
                }
            

            }
            catch (error: any)
            {
                return thunkAPI.rejectWithValue(error.message);
            }
        }
)

            