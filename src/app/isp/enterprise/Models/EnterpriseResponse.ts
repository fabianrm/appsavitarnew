export interface EnterpriseResponse {
    data: Enterprise[];
}

export interface Enterprise {
    id: number;
    ruc: string;
    name: string;
    city: City;
    address: string;
    phone: null;
    logo: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface City {
    id: number;
    name: string;
    coordinates: [number, number];
}
