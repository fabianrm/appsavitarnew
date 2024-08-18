import { Document } from "../../document/models/DocumentResponse";
import { EntryType } from "../../entry-type/models/EntryTypeResponse";
import { Supplier } from "../../supplier/models/SupplierResponse";

import { EntryDetail } from "./EntryDetailResponse";

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


