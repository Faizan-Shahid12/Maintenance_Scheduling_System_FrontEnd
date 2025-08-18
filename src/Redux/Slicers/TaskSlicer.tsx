import type { Task } from "../../Models/TaskModels/TaskModel";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AddMainTask, AssignTechnician, CompleteTask, DeleteMainTask, GetAllOverDueTasks, GetAllTask, GetTaskByEquipId, GetTaskByHistoryId, UpdateMainTask } from "../Thunks/TaskThunk";
import type { TaskLog } from "../../Models/TaskModels/TaskLogModel";
import { act } from "react";

export interface TaskState
{
    MainTask: Task[],
    HistoryTask: Task[],
    EquipmentTask: Task[],
    CurrentTask: Task|null,
    TechTask: Task[],
    loading: boolean,
    Error: string|null,
}

const initialState : TaskState = 
{
    MainTask: [],
    HistoryTask: [],
    EquipmentTask: [],
    TechTask: [],
    CurrentTask: null,
    loading: false,
    Error: null,
}

const TaskSlicer = createSlice(
    {
        name: "Task",
        initialState: initialState,
        reducers:
        {
            setCurrentTask: (state, action) => 
            {
                state.CurrentTask = action.payload;
            },
            clearHistoryTask: (state) =>
            {
                state.HistoryTask = [];
            },
            StoreTechTask: (state, action: PayloadAction<Task[]>) =>
            {
                state.TechTask = action.payload;
            },
            addTaskLogsToTask: (state, action: PayloadAction<{ taskId: number; TaskLogs: TaskLog[] }>) =>
            {
                const { taskId, TaskLogs } = action.payload;
                const Tasks = state.MainTask.find((task) => task.taskId === taskId);
                const HisTask = state.HistoryTask.find((task) => task.taskId === taskId);
                if (Tasks)
                {
                    Tasks.logs = TaskLogs
                }       
                if (HisTask)
                {
                    HisTask.logs = TaskLogs
                }
            },
            clearTaskLogsFromTask: (state, action: PayloadAction<{ taskId: number }>) =>
            {
                const { taskId } = action.payload;
                const Tasks = state.MainTask.find((task) => task.taskId === taskId);
                const HisTask = state.HistoryTask.find((task) => task.taskId === taskId);
                if (Tasks)
                {
                    Tasks.logs = [];
                }
                if(HisTask)
                {
                    HisTask.logs = [];
                }
            }
        },
        extraReducers(builder) 
        {
          builder.addCase(GetAllTask.pending, (state, action) =>
            {
                state.loading = true;
            })
            .addCase(GetAllTask.fulfilled, (state, action) =>
            {
                state.loading = false;
                state.MainTask = action.payload;
            })
            .addCase(GetAllTask.rejected, (state, action) =>
            {
                state.loading = false;
                state.Error = action.payload as string;
            });
          builder.addCase(GetAllOverDueTasks.pending, (state, action) =>
            {
                state.loading = true;
            })
            .addCase(GetAllOverDueTasks.fulfilled, (state, action) =>
            {
                state.loading = false;
                state.MainTask = action.payload;
            })
            .addCase(GetAllOverDueTasks.rejected, (state, action) =>
            {
                state.loading = false;
                state.Error = action.payload as string;
            });
          builder.addCase(GetTaskByEquipId.pending, (state) =>
            {
                state.loading = true;
            })
            .addCase(GetTaskByEquipId.fulfilled, (state, action) =>
            {
                state.loading = false;
                state.EquipmentTask = action.payload;
            })
             .addCase(GetTaskByEquipId.rejected, (state, action) =>
            {
                state.loading = false;
                state.Error = action.payload as string;
            });
          builder.addCase(GetTaskByHistoryId.pending, (state) => 
            {
                state.loading = true;
            })
            .addCase(GetTaskByHistoryId.fulfilled, (state,action) =>
            {
                state.loading = false;
                state.HistoryTask = action.payload;

            })
            .addCase(GetTaskByHistoryId.rejected, (state,action) =>
            {
                
                state.loading = false;
                state.Error = action.payload as string;
            });
          builder.addCase(AddMainTask.pending, (state) =>
            {
                state.loading = true;
            })
            .addCase(AddMainTask.fulfilled,(state,action) =>
            {
                state.MainTask.push(action.payload);
                state.loading = false;
            })
            .addCase(AddMainTask.rejected, (state,action) =>
            {
                state.loading = false;
                state.Error = action.payload as string;
            })
        builder.addCase(UpdateMainTask.pending, (state) => 
            {
                state.loading = true;
            })
            .addCase(UpdateMainTask.fulfilled, (state, action) => 
            {
                const updatedTask = action.payload;
                const index = state.MainTask.findIndex(task => task.taskId === updatedTask.taskId);
                if (index !== -1) 
                {
                    state.MainTask[index] = updatedTask;
                }
                state.loading = false;
            })
            .addCase(UpdateMainTask.rejected, (state, action) => 
            {
                state.loading = false;
                state.Error = action.payload as string;
            });
        builder.addCase(DeleteMainTask.pending, (state) => 
            {
                state.loading = true;
            })
            .addCase(DeleteMainTask.fulfilled, (state, action) => 
            {
                const deletedTask = action.payload;
                state.MainTask = state.MainTask.filter(task => task.taskId !== deletedTask.taskId);
                state.loading = false;
            })
            .addCase(DeleteMainTask.rejected, (state, action) => 
            {
                state.loading = false;
                state.Error = action.payload as string;
            });
        builder.addCase(CompleteTask.pending, (state) => 
            {
                state.loading = true;
            })
            .addCase(CompleteTask.fulfilled, (state, action) => 
            {
                const updatedTask = action.payload;
                const userRole = localStorage.getItem("Role");

                if(userRole?.includes("Admin"))
                {
                    const index = state.MainTask.findIndex(task => task.taskId === updatedTask.taskId);
                    if (index !== -1) 
                    {
                        state.MainTask[index] = updatedTask;
                    }
                }
                else if (userRole?.includes("Technician"))
                {
                   
                    const index = state.TechTask.findIndex(task => task.taskId === updatedTask.taskId);
                    if (index !== -1) 
                    {
                        state.TechTask[index] = updatedTask;
                    }
                    
                }
                state.loading = false;
            })
            .addCase(CompleteTask.rejected, (state, action) => 
            {
                state.loading = false;
                state.Error = action.payload as string;
            });

        builder.addCase(AssignTechnician.pending, (state) => 
            {
                state.loading = true;
            })
            .addCase(AssignTechnician.fulfilled, (state, action) => 
            {
                const updatedTask = action.payload;
                const index = state.MainTask.findIndex(task => task.taskId === updatedTask.taskId);
                if (index !== -1) 
                {
                    state.MainTask[index] = updatedTask;
                }
                state.loading = false;
            })
            .addCase(AssignTechnician.rejected, (state, action) => 
            {
                state.loading = false;
                state.Error = action.payload as string;
            });

        
        },

    }
)

export const { clearHistoryTask,clearTaskLogsFromTask,addTaskLogsToTask, setCurrentTask,StoreTechTask } = TaskSlicer.actions;
export default TaskSlicer.reducer;