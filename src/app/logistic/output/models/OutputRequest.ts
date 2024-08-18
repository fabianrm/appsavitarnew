export interface OutputRequest {
    date: Date;
    destination_id: number;
    employee_id: number;
    comment: string;
    total: number;
    status: number;
    output_details: OutputDetail[];
}

export interface OutputDetail {
    entry_detail_id: number;
    quantity: number;
}
