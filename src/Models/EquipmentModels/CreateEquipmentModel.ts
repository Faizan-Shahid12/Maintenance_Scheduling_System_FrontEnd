export interface CreateEquipmentModel {
  name: string;
  type: string;
  location: string;
  serialNumber: string;
  model: string; 
  WorkShopId? : number | null;
}