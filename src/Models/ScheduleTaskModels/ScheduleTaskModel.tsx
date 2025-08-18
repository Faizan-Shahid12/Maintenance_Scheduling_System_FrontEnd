export interface ScheduleTaskModel {
  scheduleTaskId: number;
  taskName: string;
  equipmentName: string;
  priority: string;
  dueDate: string;        
  interval: string;       
  assignedTo?: string;  
  techEmail?: string  
}


export interface CreateScheduleTaskModel {
  taskName: string;
  equipmentName: string;
  priority: string; 
  dueDate: string;        
  interval: string;       
  technicianId?: string | null;  
  technicianName?: string;
}
