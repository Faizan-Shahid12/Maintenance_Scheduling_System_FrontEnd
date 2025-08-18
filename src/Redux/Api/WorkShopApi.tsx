import type { WorkShop } from "../../Models/WorkShopModel/WorkShop";
import api from "../../settings/axios";


export const GetAllWorkShop_api = () =>
{
    return api.get<WorkShop[]>("/Equipment/GetAllWorkShops");
}
