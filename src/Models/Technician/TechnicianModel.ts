import type { Task } from "../TaskModels/TaskModel";

export interface TechnicianOptionModel {
  id: string;
  fullName: string;
  email: string;
}
export interface Technician
{
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    gender: string;
    createdAt: string;
    assignedTasks?: Task[];
}

export interface CreateTechnicianModel
{
  
    fullName: string;
    email: string;
    password : string;
    phoneNumber: string;
    address: string;
    gender: string;
}
