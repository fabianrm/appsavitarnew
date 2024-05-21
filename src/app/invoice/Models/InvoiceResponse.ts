export interface Invoice {
    invoiceId: number;
    contractId: string;
    amount: string;
    dueDate: string;
    status: string;
    discount: string;
    startDate: string;
    endDate: string;
    customerName: string;
    planName: string;
}

export interface InvoiceResponse {
    data: {
        invoices: Invoice[];
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
}
