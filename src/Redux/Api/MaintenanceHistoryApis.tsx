import api from "../../settings/axios"
import type MaintenanceHistory from "../../Models/HistoryModels/HistoryModel";

export const GetAllHistory_api = () =>
{
    return api.get<MaintenanceHistory[]>('/MaintenanceHistory/GetAllMaintenanceHistory');
}

export const GetHistoryById_api = (equipmentId : number) =>
{
    return api.get<MaintenanceHistory[]>('/MaintenanceHistory/GetMaintenanceHistoryByEquipmentId?EquipId=' + equipmentId);
}

export const DeleteHistory_api = (HistoryId : number) =>
{
    return api.delete('/MaintenanceHistory/DeleteMaintenanceHistory?HistoryId=' + HistoryId);
}

export const EditHistory_api = (MaintenHistory: MaintenanceHistory) =>
{
  return api.put('/MaintenanceHistory/EditMaintenanceHistory', MaintenHistory);
}