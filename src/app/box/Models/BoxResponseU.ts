export interface BoxResponseU {
    data: Box;
}

export interface Box {
    id: number;
    name: string;
    city_id: number;
    city: string;
    address: string;
    reference: string;
    latitude: number;
    longitude: number;
    totalPorts: number;
    availablePorts: number;
    status: number;
}
