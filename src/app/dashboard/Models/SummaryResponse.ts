export interface SummaryResponse {
    data: Summary;
}

export interface Summary {
    activeCustomers: number;
    activePlans: number;
    activeServices: number;
    overdueInvoices: number;
}
