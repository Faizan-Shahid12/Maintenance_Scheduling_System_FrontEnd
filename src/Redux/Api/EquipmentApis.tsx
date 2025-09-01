import type { CreateEquipmentModel } from "../../Models/EquipmentModels/CreateEquipmentModel";
import type { Equipment } from "../../Models/EquipmentModels/EquipmentModel";
import type { WorkShop } from "../../Models/WorkShopModel/WorkShop";
import api from "../../settings/axios";


export const GetAllEquipments_api = () =>
{
    return api.get<Equipment[]>("/Equipment/GetAllEquipments");
}

export const GetEquipmentById_api = (id:number) =>
{
    return api.get<Equipment>("/Equipment/GetEquipmentById?id=" + id);
}

export const GetEquipmentByName_api = (name:string) =>
{
    return api.get<Equipment[]>(
            "/Equipment/GetEquipmentByName?name=" + encodeURIComponent(name)
        );
}

export const GetArchivedEquipments_api = () =>
{
    return api.get<Equipment[]>("/Equipment/GetArchivedEquipments");
}

export const CreateNewEquipment_api = (equipment : CreateEquipmentModel) =>
{
    return api.post<Equipment>("/Equipment/CreateEquipment", equipment);
}

export const EditEquipments_api = (equipment: Equipment) =>
{
    return api.put<Equipment>("/Equipment/UpdateEquipment", equipment);
}

export const DeleteEquipments_api = (id: number) =>
{
    return  api.delete<Equipment>("/Equipment/DeleteEquipment?EquipId=" + id);
}

export const ArchiveEquipments_api = (id: number) =>
{
    return api.put<Equipment>("/Equipment/ArchiveEquipment?EquipId=" + id);
}

export const UnArchiveEquipments_api = (id: number) =>
{
    return api.put<Equipment>("/Equipment/UnArchiveEquipment?EquipId=" + id);
}

export const AssignEquipmentToWorkShop_api = (equipmentId: number, workShop: WorkShop) =>
{
    return api.put<Equipment>("/Equipment/AssignWorkShopLocation?EquipId=" + equipmentId + "",workShop);
}

export const AssignEquipmentType_api = (equipmentId: number, type: string) =>
{
    return api.put<Equipment>("/Equipment/AssignEquipType?EquipId=" + equipmentId + "&type=" + type);
}