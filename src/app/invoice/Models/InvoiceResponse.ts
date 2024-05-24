export interface InvoiceResponse {
    data: Invoice[];
    links: Links;
    meta: Meta;
}

export interface Invoice {
    invoiceId: number;
    contractId: string;
    customerName: string;
    planName: string;
    price: number;
    discount: number;
    amount: number;
    startDate: Date;
    endDate: Date;
    dueDate: Date;
    paidDated: Date | null;
    receipt: null | string;
    note: null | string;
    status: string;
}

export interface Links {
    first: string;
    last: string;
    prev: null;
    next: null;
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
