import { createAsyncThunk } from "@reduxjs/toolkit";
import { type TechnicianOptionModel, type Technician, type CreateTechnicianModel } from "../../Models/Technician/TechnicianModel";
import { ChangePassword_Api, CreateNewTechnician_api, DeleteTechnician_api, GetAllTechnicians_api, GetAllTechniciansWithoutTask_api, GetTechniciansById_api, UpdateTechnician_api } from "../Api/TechnicianApis";
import type { RootState } from "../Store";



export const GetAllTechnicians = createAsyncThunk<Technician[]>(
    "technician/getAllTechnicians",
    
    async (_, { rejectWithValue, getState }) =>
    {
        try 
        {
            
            var State = getState() as RootState
            
            if(State.Technicians.Technicians.length > 0) return rejectWithValue("Technicians Already Loaded");

            const response = await GetAllTechnicians_api();
            return response.data;
        } 
        catch (error: any) 
        {
            console.error("Failed to get Technicians :", error);
            return rejectWithValue("Unable to load Technicians.");
        }
    }
);

export const GetAllTechniciansWithoutTask = createAsyncThunk<Technician[]>(
    "technician/getAllTechnicianswithoutTask",
    
    async (_, { rejectWithValue, getState }) =>
    {
        try 
        {
            var State = getState() as RootState
            
            if(State.Technicians.TechniciansWithoutTask.length > 0) return rejectWithValue("Technicians without Tasks Already Loaded");

            const response = await GetAllTechniciansWithoutTask_api();
            return response.data;
        } 
        catch (error: any) 
        {
            
            console.error("Failed to get technician Without Task:", error);
            return rejectWithValue("Unable to load technician Without Task.");
        }
    }
);

export const GetTechniciansById = createAsyncThunk<Technician, string >(
    "technician/getTechnicianById",
    
    async (val, { rejectWithValue }) =>
    {
        try 
        {
            const response = await GetTechniciansById_api(val)
            return response.data;
        } 
        catch (error: any) 
        {
            
            console.error("Failed to get technician by Id:", error);
            return rejectWithValue("Unable to load technician by Id.");
        }
    }
);

export const GetAllTechOptions = createAsyncThunk<TechnicianOptionModel[]>(
    "technician/getAllTechOptions",
    async (_, { rejectWithValue, getState }) =>
    {
        try
        {
             var State = getState() as RootState
            
            if(State.Technicians.TechOptions.length > 0) return rejectWithValue("TechOptions Already Loaded");

            const response = await GetAllTechnicians_api();
            return response.data.map((technician: Technician) => ({
                id: technician.id,
                fullName: technician.fullName,
                email: technician.email,
                }));

        }
        catch (error: any)
        {
            console.error("Failed to get technician options:", error);
            return rejectWithValue("Unable to load technician options.");
        }
    }
)

export const CreateNewTechnician = createAsyncThunk<Technician,CreateTechnicianModel>(
    "technician/createNewTechnician",
    async (technician: CreateTechnicianModel, { rejectWithValue }) =>
        {
            try 
            {
                const response = await CreateNewTechnician_api(technician);
                return response.data;
            }
            catch (error: any) 
            {
                console.error("Failed to create technician:", error);
                return rejectWithValue("Unable to create technician.");
            }
        }
    )

export const UpdateTechnician = createAsyncThunk<Technician,Technician>(
    "technician/updateTechnician",
    async (technician: Technician, { rejectWithValue }) =>
    {
        try
        {
            const response = await UpdateTechnician_api(technician);
            return response.data;
        }
        catch (error: any)
        {
            console.error("Failed to update technician:", error);
            return rejectWithValue("Unable to update technician.");
        }
    }
)

export const DeleteTechnician = createAsyncThunk<Technician,string>(
    "technician/deleteTechnician",
    async (technician: string, { rejectWithValue }) =>
    {
        try
        {
            const response = await DeleteTechnician_api(technician);
            return response.data;

        }
        catch (error: any)
        {
            console.error("Failed to delete technician:", error);
            return rejectWithValue("Unable to delete technician.");
        }
    }
)

export const ChangePassword = createAsyncThunk<void,{TechId: string, password: string}>(
    "technician/changePassword",
    async (datapass, ThunkAPI) =>
    {
        try
        {
            const response = await ChangePassword_Api(datapass)
            return response.data;
        }
        catch (error: any)
        {
            console.error("Failed to change password:", error);
            return ThunkAPI.rejectWithValue("Unable to change password.");
        }
    }
)
