import type MaintenanceHistory from "../HistoryModels/HistoryModel";

export interface EquipmentHistory {
  equipmentId: number;
  name: string;
  type: string;
  location: string;
  serialNumber: string;
  model: string;
  isArchived: boolean;
  workShopName: string;
  workShopLocation: string;
  maintenances: MaintenanceHistory[];
}