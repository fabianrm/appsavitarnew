import { Document } from "../../document/models/DocumentResponse";
import { EntryType } from "../../entry-type/models/EntryTypeResponse";
import { Supplier } from "../../supplier/models/SupplierResponse";

export interface EntryResponse {
    data: Entry[];
}

export interface Entry {
    id: number;
    date: Date;
    series: null;
    correlative: null;
    supplier: Supplier;
    document: Document;
    entry_type: EntryType;
    status: null;
}



