export interface ContractRequest {
    data: ReqContract[];
}

export interface ReqContract {
    id: number,
    customer_id: number,
    router_id: number,
    plan_id: number,
    box_id: number,
    port_number: string,
    registration_date: Date,
    billing_date: string,
    recurrent: number,
    due_date: string,
    address_instalation: string,
    reference: string,
    city: string,
    latitude: string,
    longitude: string,
    equipment_id: number;
    is_active: string,
    status: number

}
