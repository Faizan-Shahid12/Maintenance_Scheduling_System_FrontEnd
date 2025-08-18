import { createAsyncThunk } from "@reduxjs/toolkit";
import { DeleteAttachment_api, DownloadAttachment_api, GetAllAttachment_api, UploadAttachment_api } from "../Api/AttachmentApis";
import type Attachment from "../../Models/TaskModels/AttachmentModel";


export const GetAllAttachment = createAsyncThunk<Attachment[],number>(
    "attachment/getAllAttachment",
    async (logid:number, thunkAPI) => {
        try 
        {
            const response = await GetAllAttachment_api(logid)
            return response.data;
        } 
        catch (error : any) 
        {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

export const UploadAttachment = createAsyncThunk<any, { file: File; logId: number },{ rejectValue: string }>(
  "attachment/uploadAttachment",
  async ({ file, logId }, thunkAPI) => 
  {
    try 
    {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("logId", logId.toString());

      const response = await UploadAttachment_api(formData)

      return response.data; 
    } 
    catch (error: any) 
    {
      return thunkAPI.rejectWithValue(error.message || "Upload failed");
    }
  }
);


export const DownloadAttachment = createAsyncThunk<void, number>(
  "attachment/downloadAttachment",
  async (id: number, thunkAPI) => {
    try {
      const response = await DownloadAttachment_api(id);

      const fileUrl = response.data.url;

      if (!fileUrl) {
        throw new Error("Download URL not found in response.");
      }

      // Option 1: Open in new tab
      //window.open(fileUrl, "_blank");

      // Option 2 (Optional): Auto-trigger download
       const link = document.createElement("a");
       link.href = fileUrl;
       link.setAttribute("download", "");
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);

    } 
    catch (error: any) 
    {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const DeleteAttachment = createAsyncThunk<Attachment,number>(
    "attachment/deleteAttachment",
    async (id, thunkAPI) => 
    {
        try 
        {
            const response = await DeleteAttachment_api(id);
            return response.data;
        }
        catch (error : any)
        {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
            
)