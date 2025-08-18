import type { CreateScheduleTaskModel, ScheduleTaskModel } from "../ScheduleTaskModels/ScheduleTaskModel";

export interface CreateScheduleModel {
  equipId: number;
  scheduleName: string;
  scheduleType: string;
  isActive: boolean;

  startDate: string; 
  endDate?: string | null;  
  interval: string;  

  scheduleTasks: CreateScheduleTaskModel[];
}


export interface DisplayScheduleModel {
  scheduleId: number;
  scheduleName: string;
  scheduleType: string;
  equipmentName: string;
  isActive: boolean;
  
  startDate: string; 
  endDate?: string;  
  interval: string; 

  scheduleTasks: ScheduleTaskModel[];
}

export interface DashboardScheduleModel 
{
  scheduleId: number;
  scheduleName: string;
  scheduleType: string;
  isActive: boolean;

  startDate: string; 
  endDate?: string;  
  interval: string;  
}
