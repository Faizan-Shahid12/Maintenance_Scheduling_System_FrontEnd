import type { WorkShop } from "../WorkShopModel/WorkShop";

export interface CreateEquipmentModel {
  name: string;
  type: string;
  location: string;
  serialNumber: string;
  model: string; 
  WorkShop: WorkShop;
}