import { Destination } from "../../destination/models/DestinationResponse";
import { Employee } from "../../employee/models/EmployeeResponse";
import { Material } from "../../material/models/MaterialResponse";

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
    output_details: OutputDetail[];
}

export interface OutputDetail {
    id: number;
    material: Material;
    quantity: number;
    subtotal: string;
}





