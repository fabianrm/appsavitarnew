export interface PromotionRequest {
    id: number;
    plan_id: number;
    name: string;
    start_date: Date;
    end_date: Date;
    price: number;
    duration_months: number;
    status: boolean;
}
