import { createSlice } from "@reduxjs/toolkit";
import { DeleteAttachment, DownloadAttachment, GetAllAttachment, UploadAttachment } from "../Thunks/LogAttachmentThunk";
import type Attachment from "../../Models/TaskModels/AttachmentModel";

export interface LogAttachmentState
{
    LogAttachments: Attachment[],
    HistoryLogAttachment: Attachment[],
    loading: boolean,
    Error: string|undefined,
}

const initialState : LogAttachmentState = 
{
    LogAttachments: [],
    HistoryLogAttachment: [],
    loading: false,
    Error: undefined,
}

const LogAttachmentSlice = createSlice(
    {
        name: "LogAttachment",
        initialState: initialState,
        reducers:
        {
            clearLogAttachment: (state) =>
            {
                state.LogAttachments = [];
            },
            clearHistoryLogAttachment: (state) =>
            {
                state.HistoryLogAttachment = [];
            }
        },
        extraReducers(builder) 
        {
            builder
            // 🔹 GET ATTACHMENTS
            .addCase(GetAllAttachment.pending, (state) => {
                state.loading = true;
                state.Error = undefined;
            })
            .addCase(GetAllAttachment.fulfilled, (state, action) => {
                state.loading = false;
                state.LogAttachments = action.payload;
                state.HistoryLogAttachment = action.payload;
            })
            .addCase(GetAllAttachment.rejected, (state, action) => {
                state.loading = false;
                state.Error = action.payload as string;
            })

            // 🔹 UPLOAD ATTACHMENT
            .addCase(UploadAttachment.pending, (state) => {
                state.loading = true;
                state.Error = undefined;
            })
            .addCase(UploadAttachment.fulfilled, (state, action) => {
                state.loading = false;
                state.LogAttachments.push(action.payload);
                state.HistoryLogAttachment.push(action.payload);
            })
            .addCase(UploadAttachment.rejected, (state, action) => {
                state.loading = false;
                state.Error = action.payload as string;
            })

            // 🔹 DOWNLOAD ATTACHMENT (no state change needed)
            .addCase(DownloadAttachment.rejected, (state, action) => {
                state.Error = action.payload as string;
            })

            // 🔹 DELETE ATTACHMENT
            .addCase(DeleteAttachment.pending, (state) => {
                state.loading = true;
                state.Error = undefined;
            })
            .addCase(DeleteAttachment.fulfilled, (state, action) => {
                state.loading = false;
                state.LogAttachments = state.LogAttachments.filter(
                (att) => att.id !== action.payload.id
                );
                state.HistoryLogAttachment = state.HistoryLogAttachment.filter(
                (att) => att.id !== action.payload.id
                );
            })
            .addCase(DeleteAttachment.rejected, (state, action) => {
                state.loading = false;
                state.Error = action.payload as string;
            });
        },

    }
)

export const { clearLogAttachment, clearHistoryLogAttachment } = LogAttachmentSlice.actions;
export default LogAttachmentSlice.reducer;