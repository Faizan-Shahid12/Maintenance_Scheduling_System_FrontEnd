import { createAsyncThunk } from "@reduxjs/toolkit";
import type { WorkShop } from "../../Models/WorkShopModel/WorkShop";
import { GetAllWorkShop_api } from "../Api/WorkShopApi";



export const GetWorkShopLocation = createAsyncThunk<WorkShop[]>(
    "WorkShop/getWorkShopLocation",
    async (_, { rejectWithValue }) =>
    {
        try 
        {
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