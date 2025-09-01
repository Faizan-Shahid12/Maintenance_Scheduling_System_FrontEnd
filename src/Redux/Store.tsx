import { configureStore } from "@reduxjs/toolkit";
import LoginReducer from "./Slicers/LoginSlicer";
import EquipmentReducer from "./Slicers/EquipmentSlicer";
import WorkShopReducer from "./Slicers/WorkShopSlicer";
import MaintenanceHistoryReducer from "./Slicers/HistorySlicer";
import TaskReducer from "./Slicers/TaskSlicer";
import TaskLogReducer from "./Slicers/TaskLogSlicer"
import LogAttachmentReducer from "./Slicers/LogAttachmentSlicer"
import TechnicianReducer from "./Slicers/TechnicianSlicer"
import MaintenanceScheduleReducer from "./Slicers/ScheduleSlicer"
import BarCodeReducer from "./Slicers/BarcodeSlicer"

const store = configureStore({
  reducer: {
      Login: LoginReducer,
      Equipment: EquipmentReducer,
      WorkShop: WorkShopReducer,
      MaintenanceHistory: MaintenanceHistoryReducer,
      AppTask: TaskReducer,
      TaskLog: TaskLogReducer,
      LogAttachment: LogAttachmentReducer,
      Technicians: TechnicianReducer,
      Schedule: MaintenanceScheduleReducer,
      BarCode: BarCodeReducer,
  }
  });

  
export type RootState = ReturnType<typeof store.getState>;
export type MyDispatch = typeof store.dispatch;

export default store; 
