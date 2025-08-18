import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardScheduleModel, DisplayScheduleModel } from "../../Models/MainScheduleModels/MainScheduleModel";
import { ActivateSchedule, AddScheduleTask, AssignTechnicianToScheduleTask, CreateNewSchedule, DeactivateSchedule, DeleteSchedule, DeleteScheduleTask, EditSchedule, EditScheduleTask, GetAllSchedules, GetAllSortedByDates } from "../Thunks/ScheduleThunk";


interface MaintenanceScheduleState {
  ScheduleListWithTask: DisplayScheduleModel[];
  ScheduleListWithoutTask: DashboardScheduleModel[];
  loading: boolean;
  error: string | undefined | null;
}

const initialState: MaintenanceScheduleState = 
{
  ScheduleListWithTask: [],
  ScheduleListWithoutTask: [],
  loading: false,
  error: null,
};

export const MaintenanceScheduleSlice = createSlice({
    name: 'MaintenanceSchedule',
    initialState,
    reducers: {
        clearMainSchedule: (state) => {
            state.ScheduleListWithTask= [];
            state.ScheduleListWithoutTask = [];
            state.loading = false;
            state.error = null;
            },
    },
    extraReducers: (builder) =>
    {
        builder.addCase(GetAllSchedules.pending, (state) => 
        {
            state.loading = true;
            state.error = null;
        })
        .addCase(GetAllSchedules.fulfilled,(state, action: PayloadAction<DisplayScheduleModel[]>) => 
        {
            state.ScheduleListWithTask = action.payload;
            state.loading = false;
            state.error = null;
        })
        .addCase(GetAllSchedules.rejected, (state, action) => 
        {
            state.loading = false;
            state.error = action.error.message;
        });
        
        // ---- GetAllSortedByDates ----
        builder.addCase(GetAllSortedByDates.pending, (state) => 
        {
            state.loading = true;
            state.error = null;
        })
        .addCase(GetAllSortedByDates.fulfilled, (state, action: PayloadAction<DisplayScheduleModel[]>) => 
        {
            state.loading = false;
            state.ScheduleListWithTask = action.payload;
        })
        .addCase(GetAllSortedByDates.rejected, (state, action) => 
        {
            state.loading = false;
            state.error = action.payload as string;
        });

        // ---- EditSchedule ----
        builder.addCase(EditSchedule.pending, (state) => 
        {
            state.loading = true;
            state.error = null;
        })
        .addCase(EditSchedule.fulfilled, (state, action: PayloadAction<DisplayScheduleModel>) =>
        {
            state.loading = false;
            const index = state.ScheduleListWithTask.findIndex(s => s.scheduleId === action.payload.scheduleId);
            if (index !== -1) 
            {
                state.ScheduleListWithTask[index] = action.payload;
            }
        })
        .addCase(EditSchedule.rejected, (state, action) => 
        {
            state.loading = false;
            state.error = action.payload as string;
        });

        // ---- DeleteSchedule ----
        builder.addCase(DeleteSchedule.pending, (state) =>
        {
            state.loading = true;
            state.error = null;
        })
        .addCase(DeleteSchedule.fulfilled, (state, action: PayloadAction<DisplayScheduleModel>) => 
        {
            state.loading = false;
            state.ScheduleListWithTask = state.ScheduleListWithTask.filter(s => s.scheduleId !== action.payload.scheduleId);
        })
        .addCase(DeleteSchedule.rejected, (state, action) => 
        {
            state.loading = false;
            state.error = action.payload as string;
        });

        // ---- ActivateSchedule ----
        builder.addCase(ActivateSchedule.pending, (state) => 
        {
            state.loading = true;
            state.error = null;
        })
        .addCase(ActivateSchedule.fulfilled, (state, action: PayloadAction<DisplayScheduleModel>) => 
        {
            state.loading = false;
            const index = state.ScheduleListWithTask.findIndex(s => s.scheduleId === action.payload.scheduleId);
            if (index !== -1) 
            {
                state.ScheduleListWithTask[index] = action.payload;
            }
        })
        .addCase(ActivateSchedule.rejected, (state, action) => 
        {
            state.loading = false;
            state.error = action.payload as string;
        });

        // ---- DeactivateSchedule ----
        builder.addCase(DeactivateSchedule.pending, (state) => 
        {
            state.loading = true;
            state.error = null;
        })
        .addCase(DeactivateSchedule.fulfilled, (state, action: PayloadAction<DisplayScheduleModel>) => 
        {
            state.loading = false;
            const index = state.ScheduleListWithTask.findIndex(s => s.scheduleId === action.payload.scheduleId);
            if (index !== -1) 
            {
                state.ScheduleListWithTask[index] = action.payload;
            }
        })
        .addCase(DeactivateSchedule.rejected, (state, action) => 
        {
            state.loading = false;
            state.error = action.payload as string;
        });

        // ---- AddScheduleTask ----
        builder.addCase(AddScheduleTask.pending, (state) => 
        {
            state.loading = true;
            state.error = null;
        })
        .addCase(AddScheduleTask.fulfilled, (state, action: PayloadAction<DisplayScheduleModel>) => 
        {
            state.loading = false;
            const index = state.ScheduleListWithTask.findIndex(s => s.scheduleId === action.payload.scheduleId);
            if (index !== -1) 
            {
                state.ScheduleListWithTask[index].scheduleTasks = action.payload.scheduleTasks;
            }
        })
        .addCase(AddScheduleTask.rejected, (state, action) =>
        {
            state.loading = false;
            state.error = action.payload as string;
        });

        // ---- DeleteScheduleTask ----
        builder.addCase(DeleteScheduleTask.pending, (state) => 
        {
            state.loading = true;
            state.error = null;
        })
        .addCase(DeleteScheduleTask.fulfilled, (state, action: PayloadAction<DisplayScheduleModel>) => 
        {
            state.loading = false;
            const index = state.ScheduleListWithTask.findIndex(s => s.scheduleId === action.payload.scheduleId);
            if (index !== -1) 
            {
                state.ScheduleListWithTask[index].scheduleTasks = action.payload.scheduleTasks;
            }
        })
        .addCase(DeleteScheduleTask.rejected, (state, action) => 
        {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(CreateNewSchedule.pending, (state) => 
        {
            state.loading = true;
        })
        .addCase(CreateNewSchedule.fulfilled, (state,action : PayloadAction<DisplayScheduleModel>) =>
        {
            state.loading = false;
            state.ScheduleListWithTask.push(action.payload);
        })
        .addCase(CreateNewSchedule.rejected, (state, action) =>
        {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(EditScheduleTask.pending, (state) =>
        {
            state.loading = true;
        })
        .addCase(EditScheduleTask.fulfilled, (state, action : PayloadAction<DisplayScheduleModel>) =>
        {
            state.loading = false;
            const index = state.ScheduleListWithTask.findIndex(s => s.scheduleId === action.payload.scheduleId);
            if (index !== -1) 
            {
                state.ScheduleListWithTask[index].scheduleTasks = action.payload.scheduleTasks;
            }
        })
        .addCase(EditScheduleTask.rejected, (state,action) =>
        {
            
            state.loading = false;
            state.error = action.payload as string;
        })

        builder.addCase(AssignTechnicianToScheduleTask.pending, (state) =>
        {
            state.loading = true;
        })
        .addCase(AssignTechnicianToScheduleTask.fulfilled, (state, action : PayloadAction<DisplayScheduleModel>) =>
        {
            state.loading = false;
            const index = state.ScheduleListWithTask.findIndex(s => s.scheduleId === action.payload.scheduleId);
            if (index !== -1) 
            {
                state.ScheduleListWithTask[index].scheduleTasks = action.payload.scheduleTasks;
            }
        })
        .addCase(AssignTechnicianToScheduleTask.rejected, (state,action) =>
        {
            
            state.loading = false;
            state.error = action.payload as string;
        })
    }
})


export const { clearMainSchedule } = MaintenanceScheduleSlice.actions;
export default MaintenanceScheduleSlice.reducer;