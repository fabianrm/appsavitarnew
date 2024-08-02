export interface EnterpriseResponse {
    data: Enterprise;
}

export interface Enterprise {
    id: number;
    ruc: string;
    name: string;
    cityId: number;
    city: string;
    address: string;
    phone: string;
    coordinates: [number, number];
    updatedAt: Date;
}