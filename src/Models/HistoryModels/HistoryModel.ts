import type { Task } from "../TaskModels/TaskModel";

export default interface MaintenanceHistory {
  historyId: number;
  equipmentName: string;
  equipmentType: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
};
