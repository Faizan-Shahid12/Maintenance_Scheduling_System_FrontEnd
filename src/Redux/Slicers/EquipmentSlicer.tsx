import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { type Equipment} from "../../Models/EquipmentModels/EquipmentModel";
import { ArchiveEquipment, AssignEquipmentToWorkShop, AssignEquipmentType, CreateNewEquipment, DeleteEquipment, EditEquipment, GetAllEquipment, GetArchivedEquipment, GetEquipmentById, GetEquipmentByName, UnArchiveEquipment } from "../Thunks/EquipmentThunk";
import type { EquipmentHistory } from "../../Models/EquipmentModels/EquipmentHistoryModel";
import type MaintenanceHistory from "../../Models/HistoryModels/HistoryModel";


interface EquipmentState {
  equipmentList: Equipment[];
  archivedEquipment: Equipment[];
  selectedEquipment?: Equipment | null;
  EquipmentHistory: EquipmentHistory[] | null;
  loading: boolean;
  error: string | null;
} 

const initialState: EquipmentState = 
{
  equipmentList: [],
  selectedEquipment: null,
  archivedEquipment: [],
  EquipmentHistory: null,
  loading: false,
  error: null,
};

const equipmentSlice = createSlice({
    name: "Equipment",
    initialState,
    reducers: 
    {   PlaceholderEquipment: (state, action: PayloadAction<Equipment[]>) => {
            
        },
        addMaintenanceToEquipment: (state, action: PayloadAction<{ equipmentId: number; maintenance: MaintenanceHistory[] }>
        ) =>
        {
            const { equipmentId, maintenance } = action.payload;

            if (state.EquipmentHistory !== null)
            {
                const equipment = state.EquipmentHistory.find(e => e.equipmentId === equipmentId);
                if (equipment)
                {
                    equipment.maintenances = maintenance;
                }
            }

        },
        clearMaintenanceFromEquipment: (state, action: PayloadAction<{ equipmentId: number }>) =>
        {
            if (state.EquipmentHistory !== null)
            {
                const equipment = state.EquipmentHistory.find(e => e.equipmentId === action.payload.equipmentId);
                if (equipment)
                {
                    equipment.maintenances = [];
                }
            }
        },
        clearEquipment: (state) => {
            state.equipmentList = [];
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetAllEquipment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetAllEquipment.fulfilled, (state, action: PayloadAction<Equipment[]>) => {
                state.equipmentList = action.payload;

                state.EquipmentHistory  = action.payload.map((equipment) => ({
                    ...equipment,
                    maintenances: [], 
                }));

                state.loading = false;
            })
            .addCase(GetAllEquipment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(GetEquipmentById.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetEquipmentById.fulfilled, (state, action: PayloadAction<Equipment>) => 
            {
                state.selectedEquipment = action.payload;
                state.loading = false;
            })
            .addCase(GetEquipmentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(GetEquipmentByName.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetEquipmentByName.fulfilled, (state, action: PayloadAction<Equipment[]>) => {
                state.equipmentList = action.payload;
                state.loading = false;
            })
            .addCase(GetEquipmentByName.rejected, (state, action) => {  
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(GetArchivedEquipment.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetArchivedEquipment.fulfilled, (state, action: PayloadAction<Equipment[]>) => {
                state.archivedEquipment = action.payload;
                state.loading = false;
            })
            .addCase(GetArchivedEquipment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(CreateNewEquipment.pending, (state) => {
                state.loading = true;
            })
            .addCase(CreateNewEquipment.fulfilled, (state, action: PayloadAction<Equipment>) => {
                state.equipmentList.push(action.payload);
                state.loading = false;
            })
            .addCase(CreateNewEquipment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(EditEquipment.pending, (state) => {
                state.loading = true;
            })
            .addCase(EditEquipment.fulfilled, (state, action: PayloadAction<Equipment>) => {
                const index = state.equipmentList.findIndex(e => e.equipmentId === action.payload.equipmentId);
                if (index !== -1) {
                    state.equipmentList[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(EditEquipment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(DeleteEquipment.pending, (state) => {
                state.loading = true;
            })
            .addCase(DeleteEquipment.fulfilled, (state, action: PayloadAction<Equipment>) => {
                state.equipmentList = state.equipmentList.filter(e => e.equipmentId !== action.payload.equipmentId);
                state.loading = false;
            })
            .addCase(DeleteEquipment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(ArchiveEquipment.pending, (state) => {
                state.loading = true;
            })
            .addCase(ArchiveEquipment.fulfilled, (state, action: PayloadAction<Equipment>) => 
            {
                const index = state.equipmentList.findIndex(e => e.equipmentId === action.payload.equipmentId);
                if (index !== -1) {
                    state.equipmentList[index].isArchived = true;
                    state.archivedEquipment.push(state.equipmentList[index]);
                }
                state.loading = false;
            })
            .addCase(ArchiveEquipment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(UnArchiveEquipment.pending, (state) => {
                state.loading = true;
            })
            .addCase(UnArchiveEquipment.fulfilled, (state, action: PayloadAction<Equipment>) => {
                const index = state.equipmentList.findIndex(e => e.equipmentId === action.payload.equipmentId);

                if (index !== -1)
                { 
                    state.equipmentList[index].isArchived = false;
                }

                const index1 = state.archivedEquipment.findIndex(e => e.equipmentId === action.payload.equipmentId)

                if (index1 !== -1)
                {
                    state.archivedEquipment.splice(index1, 1);
                }

                state.loading = false;
            })
            .addCase(UnArchiveEquipment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(AssignEquipmentToWorkShop.pending, (state) => {
                state.loading = true;
            })
            .addCase(AssignEquipmentToWorkShop.fulfilled, (state, action: PayloadAction<Equipment>) => {
                const index = state.equipmentList.findIndex(e => e.equipmentId === action.payload.equipmentId);
                if (index !== -1)
                {
                    state.equipmentList[index].workShopName = action.payload.workShopName;
                    state.equipmentList[index].workShopLocation = action.payload.workShopLocation;
                }
                state.loading = false;
            })
            .addCase(AssignEquipmentToWorkShop.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(AssignEquipmentType.pending, (state) => {
                state.loading = true;
            })
            .addCase(AssignEquipmentType.fulfilled, (state, action: PayloadAction<Equipment>) => {
                
                state.loading = false;
            })
            .addCase(AssignEquipmentType.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { PlaceholderEquipment,addMaintenanceToEquipment,clearMaintenanceFromEquipment, clearEquipment } = equipmentSlice.actions;
export default equipmentSlice.reducer;
