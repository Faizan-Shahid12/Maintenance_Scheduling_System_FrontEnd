import type { CreateScheduleModel, DisplayScheduleModel } from "../../Models/MainScheduleModels/MainScheduleModel";
import type { CreateScheduleTaskModel, ScheduleTaskModel } from "../../Models/ScheduleTaskModels/ScheduleTaskModel";
import api from "../../settings/axios";

export const CreateSchedule_api = async (data: CreateScheduleModel) => 
{
    return  api.post("/MaintenanceSchedule/CreateMaintenanceSchedule", data);
}

export const GetAllSchedules_api = async () =>
{
    return api.get("/MaintenanceSchedule/GetAllMaintenanceSchedules")
}

export const GetAllSchedulesByEquipmentId_api = async (Id: number) =>
{
    return api.get("/MaintenanceSchedule/GetAllMaintenanceSchedulesByEquipmentId?EquipId=" + Id)
}

export const GetAllSortedByDates_api = async () =>
{
    return api.get("/MaintenanceSchedule/GetAllSortedByStartDate")
}

export const EditSchedule_api = async (data: DisplayScheduleModel) =>
{
    return api.put("/MaintenanceSchedule/UpdateMaintenanceSchedule", data)
}

export const DeleteSchedule_api = async (Id: number) => 
{
    return api.delete("/MaintenanceSchedule/DeleteMaintenanceSchedule?ScheduleId=" + Id)
}

export const ActivateSchedule_api = async (Id: number) =>
{
    return api.put("/MaintenanceSchedule/ActivateSchedule?ScheduleId=" + Id)
}

export const DeactivateSchedule_api = async (Id: number) =>
{
    return api.put("/MaintenanceSchedule/UnActivateSchedule?ScheduleId=" + Id)
}

export const AddScheduleTask_api = async (ScheduleId: number, Task: CreateScheduleTaskModel) =>
{
    return api.post("/MaintenanceSchedule/AddNewTaskToSchedule?ScheduleId=" + ScheduleId, Task)
}

export const DeleteScheduleTask_api = async (ScheduleId: number, TaskId: number) =>
{
    return api.delete("/MaintenanceSchedule/DeleteTaskFromSchedule?ScheduleId=" + ScheduleId + "&TaskId=" + TaskId)
}

export const EditScheduleTask_api = async (ScheduleId: number, ScheduleTask1: ScheduleTaskModel) =>
{
    return api.put("/MaintenanceSchedule/EditScheduleTask?ScheduleId=" + ScheduleId, ScheduleTask1)
}

export const AssignTechnicianToScheduleTask_api = async (ScheduleId: number, ScheduleTaskId: number, TechId: string) =>
{
    return api.put("/MaintenanceSchedule/AssignTechnicianToScheduleTask?ScheduleId="+ ScheduleId + "&ScheduleTaskId=" + ScheduleTaskId + "&TechId=" + TechId)
}