export interface ExpenseRequest {
    description: string;
    amount: number;
    date: Date;
    reason: string;
    voutcher: string;
    note: string;
    datePaid: Date;
    status: boolean;
}