export interface SuspensionRequest {
    id: number;
    service_id: number;
    start_date: Date;
    end_date: Date;
    reason: string;
    observation: string;
    status: boolean;
}
