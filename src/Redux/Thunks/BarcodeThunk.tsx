import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Equipment } from "../../Models/EquipmentModels/EquipmentModel";
import api from "../../settings/axios";


export const DecodeBarCode = createAsyncThunk<Equipment | string, string>(
  "BarCode/readcode",
  async (file, thunkAPI) => 
  {
    try 
    {
      const formData = new FormData();
      formData.append("file", file);
      //ormData.append("logId", "-1");

      const response = await api.post("/BarCode/ReadQRCode?base64=" + file + "")

      return response.data;
    } 
    catch (err) 
    {
      return thunkAPI.rejectWithValue("Network error");
    }
    
  }
);

export const DownloadQRCodePDF = createAsyncThunk<void, number[]>(
  "BarCode/downloadQRCodePDF",
  async (equipmentIds, thunkAPI) => {
    try 
    {
      
      const response = await api.post("/BarCode/GenerateQRCode", equipmentIds, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      if (!(response.data instanceof Blob)) {
        console.error("Response is not a blob:", response.data);
        throw new Error("API did not return a valid PDF blob");
      }
      
      // Download the file directly in the thunk
      const filename = `QR_Codes_${equipmentIds.length}_equipment_${new Date().toISOString().split('T')[0]}.pdf`;
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return;
    }
    catch (err) 
    {
      console.error("Error in DownloadQRCodePDF:", err);
      return thunkAPI.rejectWithValue("Failed to download PDF");
    }
  }
);
