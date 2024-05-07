export interface ResponseBox {
    data: DataBox;
}

export interface DataBox {
    boxs: Box[];
}

export interface Box {
    id: number;
    name: string;
    city: string;
    address: string;
    reference: string;
    latitude: string;
    longitude: string;
    total_ports: number;
    available_ports: number;
    status: number;
}
