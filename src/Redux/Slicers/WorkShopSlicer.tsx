import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { WorkShop } from "../../Models/WorkShopModel/WorkShop";
import { GetWorkShopLocation } from "../Thunks/WorkShopThunk";

interface WorkShopState {
  WorkShopList : WorkShop[];
  selectedWorkShop?: WorkShop | null,
  loading: boolean;
  error: string | null;
}

const initialState: WorkShopState = 
{
  WorkShopList: [],
  selectedWorkShop: null,
  loading: false,
  error: null,
};

const WorkshopSlice = createSlice({
    name: "WorkShop",
    initialState,
    reducers:
    {
        PlaceholderWorkShop: (state, action: PayloadAction<WorkShop[]>) => {
            state.WorkShopList = action.payload;
        },
        clearWorkShop: (state) => {
            state.WorkShopList = [];
            state.selectedWorkShop = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => 
        {
            builder.addCase(GetWorkShopLocation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetWorkShopLocation.fulfilled, (state, action: PayloadAction<WorkShop[]>) => 
            {
                state.WorkShopList = action.payload;
                state.loading = false;
            })
            .addCase(GetWorkShopLocation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        }
});

export const { PlaceholderWorkShop, clearWorkShop } = WorkshopSlice.actions;
export default WorkshopSlice.reducer;
