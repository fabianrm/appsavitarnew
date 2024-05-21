export interface Invoice {
    id: number;
    serviceId: number;
    amount: string;
    igv: string;
    discount: string;
    letterAmount: string;
    dueDate: string;
    startDate: string;
    endDate: string;
    paidDated: string | null;
    status: string;
}

export interface InvoiceResponse {
    data: Invoice[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
}
