import { Material } from "../../material/models/MaterialResponse";

export interface KardexResponse {
    data: Kardex[];
}

export interface KardexSingleResponse {
    data: Kardex;
}

export interface Kardex {
    id: number;
    material_id: number;
    date: Date;
    has: string;
    operation: string;
    quantity: number;
    stock: string;
    comment: string;
    created_by: number;
    updated_by: number;
    created_at: Date;
    updated_at: Date;
    material: Material;
}
