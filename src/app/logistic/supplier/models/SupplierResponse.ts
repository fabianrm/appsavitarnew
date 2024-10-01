export interface SupplierResponse {
    data: Supplier[];
}

export interface SupplierSingleResponse {
    data: Supplier;
}

export interface Supplier {
    id: number;
    ruc: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    status: number;
}
