import type { Task } from "../../Models/TaskModels/TaskModel";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Technician, TechnicianOptionModel } from "../../Models/Technician/TechnicianModel";
import { ChangePassword, CreateNewTechnician, DeleteTechnician, GetAllTechnicians, GetAllTechniciansWithoutTask, GetAllTechOptions, GetTechniciansById, UpdateTechnician } from "../Thunks/TechnicianThunk";

export interface TechnicianState
{
    Technicians : Technician[],
    TechOptions: TechnicianOptionModel[],
    currentTechnician: Technician | null
    loading: boolean,
    Error: string|null,
}

const initialState : TechnicianState = 
{
    Technicians: [],
    TechOptions: [],
    currentTechnician: null,
    loading: false,
    Error: null,
}

const TechnicianSlicer = createSlice(
    {
        name: "Technician",
        initialState: initialState,
        reducers:
        {
           clearTechnician: (state) =>
           {
             state.Technicians = []
             state.TechOptions = []
           },
           AddTaskToTechnician: (state , action: PayloadAction<{TechId:string, NewTask:Task}> ) =>
           {
                const {TechId, NewTask } = action.payload;
                const tech = state.Technicians.find(t => t.id === TechId);
                if(tech)
                {
                    tech.assignedTasks?.push(NewTask);
                }
           },
           RemoveTaskFromTechnician: (state, action: PayloadAction<{TechId:string, OldTask:Task}> ) =>
           {
            const { TechId, OldTask } = action.payload;

            const Tech = state.Technicians.find(t => t.id === TechId);

            if (Tech && Tech.assignedTasks) 
            {
                Tech.assignedTasks = Tech.assignedTasks.filter(task => task.taskId !== OldTask.taskId);
            }
          }
        },
        extraReducers(builder) 
        {
           builder.addCase(GetAllTechnicians.pending, (state) => {
            state.loading = true;
            state.Error = null;
            })
            .addCase(GetAllTechnicians.fulfilled, (state, action: PayloadAction<Technician[]>) => {
            state.loading = false;
            state.Technicians = action.payload;
            })
            .addCase(GetAllTechnicians.rejected, (state, action) => {
            state.loading = false;
            state.Error = action.payload as string;
            })

            // GetAllTechOptions
            builder.addCase(GetAllTechOptions.pending, (state) => {
            state.loading = true;
            state.Error = null;
            })
            .addCase(GetAllTechOptions.fulfilled, (state, action: PayloadAction<TechnicianOptionModel[]>) => {
            state.loading = false;
            state.TechOptions = action.payload;
            })
            .addCase(GetAllTechOptions.rejected, (state, action) => {
            state.loading = false;
            state.Error = action.payload as string;
            })

            // CreateNewTechnician
            builder.addCase(CreateNewTechnician.pending, (state) => {
            state.loading = true;
            state.Error = null;
            })
            .addCase(CreateNewTechnician.fulfilled, (state, action: PayloadAction<Technician>) => {
            state.loading = false;
            state.Technicians.push(action.payload);
            state.TechOptions.push({id: action.payload.id, fullName: action.payload.fullName, email: action.payload.email})

            })
            .addCase(CreateNewTechnician.rejected, (state, action) => {
            state.loading = false;
            state.Error = action.payload as string;
            })

            // UpdateTechnician
            builder.addCase(UpdateTechnician.pending, (state) => {
            state.loading = true;
            state.Error = null;
            })
            .addCase(UpdateTechnician.fulfilled, (state, action: PayloadAction<Technician>) => {
            state.loading = false;
            const index = state.Technicians.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.Technicians[index] = action.payload;
            }
            const index1 = state.TechOptions.findIndex(t => t.id === action.payload.id);
            if (index1 !== -1) {
                state.TechOptions[index1].fullName = action.payload.fullName;
            }
            })
            .addCase(UpdateTechnician.rejected, (state, action) => {
            state.loading = false;
            state.Error = action.payload as string;
            })

            // DeleteTechnician
            builder.addCase(DeleteTechnician.pending, (state) => {
            state.loading = true;
            state.Error = null;
            })
            .addCase(DeleteTechnician.fulfilled, (state, action: PayloadAction<Technician>) => {
            state.loading = false;
            state.Technicians = state.Technicians.filter(t => t.id !== action.payload.id);
            state.TechOptions = state.TechOptions.filter(t => t.id !== action.payload.id);
            })
            .addCase(DeleteTechnician.rejected, (state, action) => {
            state.loading = false;
            state.Error = action.payload as string;
            });

            builder.addCase(GetTechniciansById.pending, (state) =>
            {
                state.loading = true;
            })
            .addCase(GetTechniciansById.fulfilled, (state, action: PayloadAction<Technician>) =>
            {
                state.loading = false;
                state.currentTechnician = action.payload;
            })
            .addCase(GetTechniciansById.rejected, (state, action) =>
            {
                state.loading = false;
                state.Error = action.payload as string;
            })

            builder.addCase(ChangePassword.pending, (state) =>
            {
                state.loading = true;
            })
            .addCase(ChangePassword.fulfilled, (state) =>
            {
                state.loading = false;
            })
            .addCase(ChangePassword.rejected, (state, action) =>
            {
                state.loading = false;
                state.Error = action.payload as string;
            })

            builder.addCase(GetAllTechniciansWithoutTask.pending, (state) =>
            {
                state.loading = true;
            })
            .addCase(GetAllTechniciansWithoutTask.fulfilled, (state, action : PayloadAction<Technician[]>) =>
            {
                state.Technicians = action.payload
                state.loading = false;
            })
            .addCase(GetAllTechniciansWithoutTask.rejected, (state, action) =>
            {
                state.loading = false;
                state.Error = action.payload as string;
            })
        
        },

    }
)

export const { clearTechnician,AddTaskToTechnician,RemoveTaskFromTechnician } = TechnicianSlicer.actions;
export default TechnicianSlicer.reducer;