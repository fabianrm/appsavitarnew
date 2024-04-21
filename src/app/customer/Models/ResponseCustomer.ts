export interface ResponseCustomer {
    data: ReqCustomer[];
    links: Links;
    meta: Meta;
}

export interface ReqCustomer {
    id: number;
    type: Type;
    document_number: string;
    name: string;
    address: string;
    phone_number: string;
    email: string;
    status: number;
}

export enum Type {
    Juridica = "juridica",
    Natural = "natural",
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
