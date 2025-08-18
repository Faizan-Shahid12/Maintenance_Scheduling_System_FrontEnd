import type { CreateTaskModel } from "../../Models/TaskModels/CreateTaskModel";
import type { Task } from "../../Models/TaskModels/TaskModel";
import api from "../../settings/axios"


export const GetAllTask_api = () =>
{
   return api.get("/MainTask/GetAllTasks")
}

export const GetTaskByEquipmentId_api = (equipId:number) =>
{
    return api.get("/MainTask/GetTaskByEquipId?EquipId=" + equipId);
}

export const GetTaskByHistoryId_api = (historyId:number) =>
{
    return api.get("/MainTask/GetTaskByHistoryId?HistoryId=" + historyId);
}

export const AddMainTask_api = (task : CreateTaskModel) =>
{
    return api.post("/MainTask/AddNewMainTask?equipid="+ task.equipId, task);
}

export const UpdateTask_api = (task : Task) =>
{
    return api.put("/MainTask/UpdateTask", task);
}

export const DeleteTask_api = (task : Task) =>
{
    return api.delete("/MainTask/DeleteTask?TaskId=" + task.taskId)
}

export const CompleteTask_api = (task : Task) =>
{
    return api.patch("/MainTask/CompleteTask?TaskId=" + task.taskId);
}

export const AssignTechnician_api_1 = (taskId: number, TechId: string) =>
{
    return api.patch("/MainTask/AssignTechnician?TaskId=" + taskId + "&TechId=" + TechId);
}

export const AssignTechnician_api_2 = (taskId: number) =>
{
    return api.patch("/MainTask/AssignTechnician?TaskId=" + taskId);
}