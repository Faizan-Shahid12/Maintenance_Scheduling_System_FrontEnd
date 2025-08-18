
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TaskLog } from "../../Models/TaskModels/TaskLogModel";
import { CreateTaskLog, DeleteTaskLog, GetAllTaskLogs, UpdateTaskLog } from "../Thunks/TaskLogThunk";
import type Attachment from "../../Models/TaskModels/AttachmentModel";

export interface TaskLogState
{
    Log: TaskLog[],
    HistoryLog: TaskLog[],
    loading: boolean,
    Error: string|undefined,
}

const initialState : TaskLogState = 
{
    Log: [],
    HistoryLog: [],
    loading: false,
    Error: undefined,
}

const TaskLogSlice = createSlice(
    {
        name: "TaskLog",
        initialState: initialState,
        reducers:
        {
            clearTaskLog: (state) =>
            {
                state.Log = [];
            },
            clearLogofTask: (state) =>
            {
                state.HistoryLog = [];
            },
            addAttachmentToTaskLog: (state, action: PayloadAction<{ LogId: number; attachs: Attachment[] }>) =>
            {
                var {LogId , attachs} = action.payload;
                var log = state.HistoryLog.find(t => t.logId === LogId)
                var log1 = state.Log.find(t => t.logId === LogId)
                if(log)
                {
                    log.attachments = attachs;
                }
                if(log1)
                {
                    log1.attachments = attachs;
                }
            },
            clearAttachmentFromTaskLog: (state, action: PayloadAction<{ LogId: number;}>) =>
            {
                var {LogId} = action.payload;
                var log = state.HistoryLog.find(t => t.logId === LogId)
                var log1 = state.Log.find(t => t.logId === LogId)
                if(log)
                {
                    log.attachments = [];
                }
                if(log1)
                {
                    log1.attachments = [];
                }
            },
        },
        extraReducers(builder) 
        {
        builder.addCase(GetAllTaskLogs.pending, (state) => 
            {
                state.loading = true;
            })
            .addCase(GetAllTaskLogs.fulfilled, (state,action) =>
            {
                state.Log = action.payload;
                state.HistoryLog = action.payload;
            })
            .addCase(GetAllTaskLogs.rejected,(state,action) =>
            {
                state.loading = true;
                state.Error = action.error.message;
            })

        builder.addCase(CreateTaskLog.pending, (state) => 
            {
                 state.loading = true;
            })
            .addCase(CreateTaskLog.fulfilled, (state, action) =>
            {
                state.Log.push(action.payload);
                state.HistoryLog.push(action.payload);
                state.loading = false;
            })
            .addCase(CreateTaskLog.rejected, (state, action) =>     
            {
                state.loading = false;
                state.Error = action.error.message;
            });

        builder.addCase(UpdateTaskLog.pending, (state) => 
            {
                state.loading = true;
            })
            .addCase(UpdateTaskLog.fulfilled, (state, action) => 
            {
                const index = state.Log.findIndex((log) => log.logId === action.payload.logId);
                if (index !== -1) state.Log[index] = action.payload;

                const histIndex = state.HistoryLog.findIndex((log) => log.logId === action.payload.logId);
                if (histIndex !== -1) state.HistoryLog[histIndex] = action.payload;

                state.loading = false;
            })
            .addCase(UpdateTaskLog.rejected, (state, action) => 
            {
                state.loading = false;
                state.Error = action.error.message;
            });

            // DeleteTaskLog
        builder.addCase(DeleteTaskLog.pending, (state) => 
            {
                state.loading = true;
            })
            .addCase(DeleteTaskLog.fulfilled, (state, action) => 
            {
                state.Log = state.Log.filter((log) => log.logId !== action.payload.logId);
                state.HistoryLog = state.HistoryLog.filter((log) => log.logId !== action.payload.logId);
                state.loading = false;
            })
            .addCase(DeleteTaskLog.rejected, (state, action) => 
            {
                state.loading = false;
                state.Error = action.error.message;
            });
        },

    }
)

export const { clearTaskLog, clearLogofTask,clearAttachmentFromTaskLog,addAttachmentToTaskLog } = TaskLogSlice.actions;
export default TaskLogSlice.reducer;