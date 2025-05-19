export interface PromotionResponse {
    data: Promotion[];
}

export interface PromotionSingleResponse {
    data: Promotion;
}


export interface Promotion {
    id: number;
    enterprise: string;
    plan: Plan;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    price: string;
    duration_months: number;
    status: string;
    created_at: Date;
    created_by: string;
}

interface Plan {
    id: number;
    name: string;
}
