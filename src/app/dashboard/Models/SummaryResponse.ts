export interface SummaryResponse {
    data: Summary;
}

export interface Summary {
    activeCustomers: number;
    activePlans: number;
    pendingInvoices: number;
    overdueInvoices: number;
}
