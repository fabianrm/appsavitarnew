export interface EnterpriseResponse {
    data: Enterprise;
}

export interface Enterprise {
    id: number;
    ruc: string;
    name: string;
    city_id: number;
    city: string;
    address: string;
    coordinates: [number, number];
    status: null;
}