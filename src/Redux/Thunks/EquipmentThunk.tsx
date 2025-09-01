import { createAsyncThunk } from "@reduxjs/toolkit";
import type { CreateEquipmentModel } from "../../Models/EquipmentModels/CreateEquipmentModel";
import type { Equipment } from "../../Models/EquipmentModels/EquipmentModel";
import { ArchiveEquipments_api, AssignEquipmentToWorkShop_api, AssignEquipmentType_api, CreateNewEquipment_api, DeleteEquipments_api, EditEquipments_api, GetAllEquipments_api, GetArchivedEquipments_api, GetEquipmentById_api, GetEquipmentByName_api, UnArchiveEquipments_api } from "../Api/EquipmentApis";
import type { RootState } from "../Store";
import type { WorkShop } from "../../Models/WorkShopModel/WorkShop";

export const GetAllEquipment = createAsyncThunk<Equipment[]>(
    "Equipment/getAllEquipment",
    async (state, { rejectWithValue,getState }) => {
        try 
        {
            var State = getState() as RootState

            if(State.Equipment.equipmentList.length > 0) return rejectWithValue("Equipment Already Loaded");

            const response = await GetAllEquipments_api();
            return response.data;
        } catch (error: any)
        {
            console.error("Failed to get equipment:", error);
            return rejectWithValue("Unable to load equipment data.");
        }
    }
);

export const GetEquipmentById = createAsyncThunk<Equipment, number>(
    "Equipment/getEquipmentById",
    async (id, { rejectWithValue }) => 
    {
        try 
        {
            const response = await GetEquipmentById_api(id);
            return response.data;
        } 
        catch (error: any)
        {
            console.error("Failed to get equipment:", error);
            return rejectWithValue("Unable to load equipment data.");
        }
    }
)
export const GetEquipmentByName = createAsyncThunk<Equipment[], string>(
    "Equipment/getEquipmentByName",
    async (name, { rejectWithValue }) => 
    {
        try 
        {
        const response = await GetEquipmentByName_api(name);

        if (response.data.length === 0) {
            return rejectWithValue("No equipment found with the given name.");
        }

        return response.data;
        } 
        catch (error) {
        console.error("Failed to get equipment by name:", error);
        return rejectWithValue("Unable to load equipment data.");
        }
  }
);

export const GetArchivedEquipment = createAsyncThunk<Equipment[]>(
    "Equipment/getArchivedEquipment",
    async (state, { rejectWithValue, getState}) =>
    {
        try
        {
            var State = getState() as RootState

            if(State.Equipment.archivedEquipment.length > 0) return rejectWithValue("Equipment Already Loaded");

            const response = await GetArchivedEquipments_api();
            return response.data;
        }
        catch (error: any)
        {
            console.error("Failed to get archived equipment:", error);
            return rejectWithValue("Unable to load archived equipment data.");
        }
    }
);

export const CreateNewEquipment = createAsyncThunk<Equipment, CreateEquipmentModel>(
    "Equipment/createNewEquipment",
    async (equipment, { rejectWithValue }) => 
    {
        try 
        {
            const response = await CreateNewEquipment_api(equipment);
         
            if (equipment?.WorkShop.workShopId && equipment?.WorkShop.workShopId > 0 && response?.data?.equipmentId) 
            {
                const response1 = await AssignEquipmentToWorkShop_api(response.data.equipmentId, equipment.WorkShop);
                return response1.data;
            }

            return response.data;
        } 
        catch (error: any) 
        {
            console.error("Failed to create new equipment:", error);
            return rejectWithValue("Unable to create new equipment.");
        }
    });

export const EditEquipment = createAsyncThunk<Equipment, Equipment>(
    "Equipment/EditEquipment",
    async (equipment, { rejectWithValue }) => 
    {
        try 
        {
            const response = await EditEquipments_api(equipment);
            return response.data;
        } 
        catch (error: any) 
        {
            console.error("Failed to create new equipment:", error);
            return rejectWithValue("Unable to create new equipment.");
        }
    });

export const DeleteEquipment = createAsyncThunk<Equipment, Equipment>(
    "Equipment/DeleteEquipment",
    async (equipment, { rejectWithValue }) => 
    {
        try 
        {
            const response = await DeleteEquipments_api(equipment.equipmentId);
            return response.data;
        } 
        catch (error: any) 
        {
            console.error("Failed to create new equipment:", error);
            return rejectWithValue("Unable to create new equipment.");
        }
    });

export const ArchiveEquipment = createAsyncThunk<Equipment, Equipment>(
    "Equipment/ArchiveEquipment",
    async (equipment, { rejectWithValue }) => 
    {
        try 
        {
            const response = await ArchiveEquipments_api(equipment.equipmentId);
            return response.data;
        } 
        catch (error: any) 
        {
            console.error("Failed to archive equipment:", error);
            return rejectWithValue("Unable to archive equipment.");
        }
    }); 

export const UnArchiveEquipment = createAsyncThunk<Equipment, Equipment>(
    "Equipment/UnArchiveEquipment",
    async (equipment, { rejectWithValue }) => 
    {
        try 
        {
            const response = await UnArchiveEquipments_api(equipment.equipmentId);
            return response.data;
        } 
        catch (error: any) 
        {
            console.error("Failed to unarchive equipment:", error);
            return rejectWithValue("Unable to unarchive equipment.");
        }
    });

export const AssignEquipmentToWorkShop = createAsyncThunk<Equipment, { equipmentId: number; workShop: WorkShop }>(
    "Equipment/AssignEquipmentToWorkShop",
    async ({ equipmentId, workShop }, { rejectWithValue }) => 
    {
        try 
        {
            const response = await AssignEquipmentToWorkShop_api(equipmentId, workShop);
            return response.data;
        } 
        catch (error: any) 
        {
            console.error("Failed to assign equipment to workshop:", error);
            return rejectWithValue("Unable to assign equipment to workshop.");
        }
    });
export const AssignEquipmentType = createAsyncThunk<Equipment, { equipmentId: number; type: string }>(
    "Equipment/AssignEquipmentType",
    async ({ equipmentId, type }, { rejectWithValue }) => 
    {
        try 
        {
            const response = await AssignEquipmentType_api(equipmentId, type);
            return response.data;
        } 
        catch (error: any) 
        {
            console.error("Failed to assign equipment type:", error);
            return rejectWithValue("Unable to assign equipment type.");
        }
    });