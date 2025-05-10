import { Service } from "../../contract/Models/ServiceResponse";


export interface SuspensionResponse {
    data: Suspension[];
}

export interface SuspensionSingleResponse {
    message: string;
    suspension: Suspension;
}

export interface Suspension {
    id: number;
    enterprise_id: number;
    service: Service;
    start_date: Date;
    end_date: Date;
    reason: string;
    observation: string;
    created_by: number;
    updated_by: number;
    updated_at: Date;
    created_at: Date;
}

