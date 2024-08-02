export interface WarehouseResponse {
    data: Warehouse[];
}

export interface WarehouseSingleResponse {
    data: Warehouse;
}

export interface Warehouse {
    id: number;
    name: string;
    address: string;
    status: number;
}
