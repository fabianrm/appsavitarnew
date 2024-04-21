export interface ContractResponse {
    data: ResContract[];
}

export interface ResContract {
    id: string,
    router_ip: string,
    customer_name: string,
    plan_name: string,
    box_name: string,
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
