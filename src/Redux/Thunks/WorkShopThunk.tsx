import { createAsyncThunk } from "@reduxjs/toolkit";
import type { WorkShop } from "../../Models/WorkShopModel/WorkShop";
import { GetAllWorkShop_api } from "../Api/WorkShopApi";
import type { RootState } from "../Store";



export const GetWorkShopLocation = createAsyncThunk<WorkShop[]>(
    "WorkShop/getWorkShopLocation",
    async (_, { rejectWithValue, getState }) =>
    {
        try 
        { 
            var State = getState() as RootState
        
            if(State.WorkShop.WorkShopList.length > 0) return rejectWithValue("WorkShop already loaded");

            const response = await GetAllWorkShop_api();
            return response.data;
        } 
        catch (error: any) 
        {
            console.error("Failed to get workshop locations:", error);
            return rejectWithValue("Unable to load workshop locations.");
        }
    }
);