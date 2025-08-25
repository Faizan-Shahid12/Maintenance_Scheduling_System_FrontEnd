import api from "../../settings/axios"
import type MaintenanceHistory from "../../Models/HistoryModels/HistoryModel";

export const GetAllCount_Api = () =>
{
    return api.get<number[]>('/MaintenanceHistory/GetTotalCount');
}

export const GetAllHistory_api = () =>
{
    return api.get<MaintenanceHistory[]>('/MaintenanceHistory/GetAllMaintenanceHistory');
}

export const GetHistoryById_api = (equipmentId : number) =>
{
    return api.get<MaintenanceHistory[]>('/MaintenanceHistory/GetMaintenanceHistoryByEquipmentId?EquipId=' + equipmentId);
}

export const CreateMaintenanceHistory_api = (maintenanceHistory: {
    equipmentId: number;
    equipmentName: string;
    equipmentType: string;
    startDate: string;
    endDate: string;
}) =>
{
    return api.post<MaintenanceHistory>('/MaintenanceHistory/CreateMaintenanceHistory', maintenanceHistory);
}

export const DeleteHistory_api = (HistoryId : number) =>
{
    return api.delete('/MaintenanceHistory/DeleteMaintenanceHistory?HistoryId=' + HistoryId);
}

export const EditHistory_api = (MaintenHistory: MaintenanceHistory) =>
{
  return api.put('/MaintenanceHistory/EditMaintenanceHistory', MaintenHistory);
}