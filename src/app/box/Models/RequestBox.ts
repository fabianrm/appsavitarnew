export interface RequestBox {
    data: ReqBox[];
}

export interface ReqBox {
    id: number;
    name: string;
    city_id: number;
    address: string;
    reference: string;
    latitude: string;
    longitude: string;
    totalPorts: number;
    availablePorts: number;
    status: number;
}
