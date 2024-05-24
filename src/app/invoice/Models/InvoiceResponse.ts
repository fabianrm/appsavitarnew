export interface Invoice {
    invoiceId: number;
    contractId: string;
    customerName: string;
    planName: string;
    price: number;
    discount: number;
    amount: number;
    startDate: string;
    endDate: string;
    dueDate: string;
    paidDated: string;
    receipt: string;
    note: string;
    status: string;
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
