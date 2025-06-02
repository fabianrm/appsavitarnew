export interface SummaryResponse {
    data: Summary;
}

export interface Summary {
    activeCustomers: number;
    activePlans: number;
    pendingInvoices: number;
    overdueInvoices: number;
    totalPaidDay: number;
    paidDaySum: number;
    paidMonthSum: number;
    overduePaidSum: number;
    expenseDaySum: number;
    expenseMonthSum: number;
    paidYearSum: number;
    expenseYearSum: number;
    resumeTotalYear: number;

}
