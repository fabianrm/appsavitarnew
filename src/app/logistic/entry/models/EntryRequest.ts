export interface EntryRequest {
    date: Date;
    document_number: string;
    supplier_id: number;
    document_id: number;
    entry_type_id: number;
    total: number;
    status: boolean;
    entry_details: EntryDetail[];
}

export interface EntryDetail {
    date: Date;
    material_id: number;
    quantity: number;
    price: number;
    warehouse_id: number;
    location: string;
}
