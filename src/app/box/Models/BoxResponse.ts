export interface BoxResponse {
    data: Box[];
    total: number;
}

export interface Box {
    id: number;
    name: string;
    city_id: number;
    city: string;
    address: string;
    reference: string;
    latitude: string;
    longitude: string;
    totalPorts: number;
    availablePorts: number;
    status: number;
    coordinates: string[];
}
