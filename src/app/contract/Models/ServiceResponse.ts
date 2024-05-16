export interface ServiceResponse {
    data: Service;
}

export interface Service {
    id: number;
    customer_id: number;
    router_id: number;
    plan_id: number;
    box_id: number;
    port_number: string;
    registration_date: Date;
    billing_date: string;
    recurrent: number;
    due_date: string;
    address_instalation: string;
    reference: null;
    city_id: number;
    equipment_id: number;
    latitude: string;
    longitude: string;
    is_active: number;
    status: number;
}
