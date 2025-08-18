import type { CreateTechnicianModel, Technician } from "../../Models/Technician/TechnicianModel";
import api from "../../settings/axios";


export const GetAllTechnicians_api = () =>
{
    return api.get("/Authentication/GetTechnicians");
}

export const GetAllTechniciansWithoutTask_api = () =>
{
    return api.get("/Authentication/GetTechniciansWithoutTask");
}

export const GetTechniciansById_api = (TechId: string) =>
{
    
    return api.get("/Authentication/GetTechniciansById?TechId=" + TechId);
}

export const CreateNewTechnician_api = (Tech: CreateTechnicianModel) =>
{
    return api.post("/Authentication/CreateTechnician",Tech)
}

export const UpdateTechnician_api = (Tech: Technician) =>
{
    return api.put("/Authentication/UpdateTechnician?id=" + Tech.id,Tech)
}

export const DeleteTechnician_api = (id: string) =>
{
    return api.delete("/Authentication/DeleteTechnician?id=" + id)
}

export const ChangePassword_Api = ({ TechId, password }: { TechId: string, password: string }) =>
{
    return api.patch("/Authentication/ChangePassword?TechId=" + TechId,{newPassword: password})
}