import { Document } from "../../document/models/DocumentResponse";
import { EntryType } from "../../entry-type/models/EntryTypeResponse";
import { Material } from "../../material/models/MaterialResponse";
import { Supplier } from "../../supplier/models/SupplierResponse";
import { Warehouse } from "../../warehouse/models/WarehouseResponse";

export interface EntryResponse {
    data: Entry[];
}

export interface EntrySingleResponse {
    data: Entry;
}

export interface Entry {
    id: number;
    date: Date;
    document_number: string;
    supplier: Supplier;
    document: Document;
    entry_type: EntryType;
    entry_details: EntryDetail[];
    total: number;
    status: null;
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

