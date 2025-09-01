import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Equipment } from "../../Models/EquipmentModels/EquipmentModel";
import { DecodeBarCode, DownloadQRCodePDF } from "../Thunks/BarcodeThunk";

interface BarcodeState {
  Equipment : Equipment | null;
  DownloadBarCodes: Equipment[] 
  ReturnValue: string;
  loading: boolean;
  error: string | null;
}

const initialState: BarcodeState = 
{
  Equipment: null,
  DownloadBarCodes: [],
  ReturnValue : "",
  loading: false,
  error: null,
};

const BarCodeSlice = createSlice({
    name: "BarCode",
    initialState,
    reducers:
    {
        clearBarCode: (state) => {
            state.Equipment = null;
            state.ReturnValue = "";
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => 
        {
            builder.addCase(DecodeBarCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(DecodeBarCode.fulfilled, (state, action: PayloadAction<Equipment | string>) => 
            {
                if( typeof action.payload === "string")
                {
                    state.ReturnValue = action.payload;
                }
                else if (action.payload && typeof action.payload === "object" && "equipmentId" in action.payload) 
                {
                    state.Equipment = action.payload;
                }
                state.loading = false;
            })
            .addCase(DecodeBarCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // PDF Download cases
            .addCase(DownloadQRCodePDF.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(DownloadQRCodePDF.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(DownloadQRCodePDF.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
                         ;
        }
});

export const {clearBarCode } = BarCodeSlice.actions;
export default BarCodeSlice.reducer;
