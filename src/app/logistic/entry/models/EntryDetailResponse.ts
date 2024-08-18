import { Material } from "../../material/models/MaterialResponse";
import { Warehouse } from "../../warehouse/models/WarehouseResponse";

export interface EntryDetailResponse {
    data: EntryDetail[];
}

export interface EntryDetailSingleResponse {
    data: EntryDetail;
}


export interface EntryDetail {
    id: number;
    date: Date;
    material: Material;
    quantity: number;
    current_stock: number;
    price: number;
    subtotal: number;
    warehouse: Warehouse;
    location: string;
}
