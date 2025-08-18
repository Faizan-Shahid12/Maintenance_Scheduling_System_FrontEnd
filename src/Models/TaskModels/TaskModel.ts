import type { TaskLog } from "./TaskLogModel";

export interface Task {
  taskId: number;
  taskName: string;
  equipmentName: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'Completed' | 'OverDue' ;
  dueDate: string;
  assignedTo: string;
  techEmail: string;
  logs: TaskLog[];
}