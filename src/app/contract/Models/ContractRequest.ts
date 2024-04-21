export interface ContractRequest {
    data: ReqContract[];
}

export interface ReqContract {
    id: number,
    router_id: number,
    customer_id: number,
    plan_id: number,
    box_id: number,
    port_number: string,
    registration_date: Date,
    billing_date: string,
    recurrent: number,
    due_date: string,
    address_instalation: string,
    city: string,
    latitude: string,
    longitude: string,
    is_active: string,
    status: number

}
