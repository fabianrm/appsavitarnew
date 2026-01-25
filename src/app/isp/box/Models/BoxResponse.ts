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
    type: string;
    reference: string;
    latitude: string;
    longitude: string;
    totalPorts: number;
    availablePorts: number;
    note: string;
    status: number;
    coordinates: string[];
}
