import { Destination } from "../../destination/models/DestinationResponse";
import { Employee } from "../../employee/models/EmployeeResponse";
import { EntryDetail } from "../../entry/models/EntryDetailResponse";

export interface OutputResponse {
    data: Output[];
}

export interface OutputSingleResponse {
    data: Output;
}

export interface Output {
    id: number;
    number: string;
    date: Date;
    destination: Destination;
    employee: Employee;
    total: string;
    comment: string;
    status: number;
    details: Detail[];
}

export interface Detail {
    id: number;
    entry_detail_id: number;
    entry_detail: EntryDetail;
    quantity: number;
    subtotal: string;
}





