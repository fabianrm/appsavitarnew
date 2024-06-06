export interface ExpenseResponse {
    data: Expense[];
    total: number;
}
export interface ExpenseResponseUnique {
    data: Expense;
    total: number;
}

export interface Expense {
    id: number;
    description: string;
    amount: string;
    date: Date;
    reasonId: number;
    reason: string;
    voutcher: string;
    note: string;
    datePaid: string;
    userId: number;
    createdBy: null;
    updatedBy: null;
    updatedAt: Date;
}
