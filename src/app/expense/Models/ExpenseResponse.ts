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
    type: string;
    description: string;
    amount: number;
    date: Date;
    reasonId: number;
    reason: string;
    voutcher: string;
    note: string;
    status: boolean;
    datePaid: string;
    userId: number;
    createdBy: null;
    updatedBy: null;
    updatedAt: Date;
}
