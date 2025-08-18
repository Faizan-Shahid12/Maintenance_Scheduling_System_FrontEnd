import type { TaskLog } from "../../Models/TaskModels/TaskLogModel"
import api from "../../settings/axios"

export const GetAllTaskLog_api = (Taskid:number) =>
{
   return api.get("/MainTaskLog/GetAllLogs?taskId=" + Taskid)
}

export const CreateTaskLog_api = (taskLogData: {taskId: number, note: string}) => 
{
   return api.post("/MainTaskLog/CreateTaskLog", taskLogData)
}

export const UpdateTaskLog_api = (TaskLogData : TaskLog) =>
{

    return api.put("/MainTaskLog/UpdateLog", TaskLogData)
}

export const DeleteTaskLog_api = (LogId : number) =>
{
    return api.delete("/MainTaskLog/DeleteLog?logId=" + LogId)
}