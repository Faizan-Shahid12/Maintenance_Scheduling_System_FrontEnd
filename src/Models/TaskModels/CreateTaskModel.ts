export interface CreateTaskModel {
  equipId: number;
  technicianId: string | null;
  taskName: string;
  equipmentName: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'OverDue' | 'Completed';
  dueDate: string;
}