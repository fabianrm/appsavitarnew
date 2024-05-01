export interface ResponseBox {
    data: ReqBox[];
    links: Links;
    meta: Meta;
}

export interface ReqBox {
    id: number;
    name: string
    city: string;
    address: string;
    reference: string;
    latitude: string;
    longitude: string;
    total_ports: number;
    available_ports: number;
    status: number;
}

export interface Links {
    first: string;
    last: string;
    prev: null;
    next: string;
}

export interface Meta {
    current_page: number;
    from: number;
    last_page: number;
    links: Link[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}

export interface Link {
    url: null | string;
    label: string;
    active: boolean;
}
