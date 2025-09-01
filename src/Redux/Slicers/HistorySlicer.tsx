import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type MaintenanceHistory from "../../Models/HistoryModels/HistoryModel";
import { GetAllCount, GetAllHistory, GetHistoryByEquipmentId } from "../Thunks/HistoryThunk";
import type { Task } from "../../Models/TaskModels/TaskModel";


interface MaintenanceHistoryState {
  MaintenanceHistoryList: MaintenanceHistory[];
  EquipHistory: MaintenanceHistory[];
  Count: number[];
  loading: boolean;
  error: string | undefined | null;
}

const initialState: MaintenanceHistoryState = 
{
  MaintenanceHistoryList: [],
  EquipHistory: [],
  Count: [],
  loading: false,
  error: null,
};

export const MaintenanceHistorySlice = createSlice({
    name: 'MaintenanceHistory',
    initialState,
    reducers: {
        clearHistory: (state) => {
            state.MaintenanceHistoryList = [];
            state.EquipHistory = [];
            state.loading = false;
            state.error = null;
            },
        clearEquipmentHistory: (state) => {
            state.EquipHistory = [];
        },
        addTaskToMaintenance: (state, action: PayloadAction<{ historyId: number; Tasks: Task[] }>) => 
        {
            const { historyId, Tasks } = action.payload;
            const maintenance = state.EquipHistory.find(mh => mh.historyId === historyId);
            if (maintenance) 
            {
                maintenance.tasks = Tasks;
            }
        },
        clearTaskFromMaintenance: (state,action: PayloadAction<number>) => 
        {
            const maintenance = state.EquipHistory.find(mh => mh.historyId === action.payload);

            if( maintenance)
            {
                maintenance.tasks = [];
            }
        },
        PlaceholderHistory: (state) =>
        {

        }
    },
    extraReducers: (builder) =>
    {
        builder.addCase(GetAllHistory.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
        .addCase(GetAllHistory.fulfilled, (state, action) => {
            state.MaintenanceHistoryList = action.payload;
            state.loading = false;
            state.error = null;
            })
        .addCase(GetAllHistory.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(GetHistoryByEquipmentId.pending, (state,action) =>
        {
            state.loading = true;
            state.error = null;
        })
        .addCase(GetHistoryByEquipmentId.fulfilled, (state,action) =>
        {
            state.EquipHistory = action.payload
            state.loading = false;
            state.error = null;
        })
        .addCase(GetHistoryByEquipmentId.rejected, (state,action) =>
        {
            state.loading = false;
            state.error = action.error.message;
        })
        .addCase(GetAllCount.pending, (state) =>
        {
            state.loading = true;
        })
        .addCase(GetAllCount.fulfilled,(state,action) => {
            state.loading = false;
            state.Count = action.payload;
        })
        .addCase(GetAllCount.rejected, (state, action) =>
        {
            state.loading = false;
            state.error = action.payload as string;
        })

    }
})


export const { PlaceholderHistory,clearEquipmentHistory,addTaskToMaintenance,clearTaskFromMaintenance, clearHistory } = MaintenanceHistorySlice.actions;
export default MaintenanceHistorySlice.reducer;