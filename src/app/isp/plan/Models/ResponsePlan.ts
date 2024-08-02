export interface ResponsePlan {
    data: ReqPlan[];
}

export interface ReqPlan {
    id: number;
    name: string;
    download: string;
    upload: string;
    price: number;
    guaranteed_speed: string;
    priority: string;
    burst_limit: string;
    burst_threshold: string;
    burst_time: string;
    status: number;
}
