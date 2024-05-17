export interface RequestPlan {
    id: number;
    name: string;
    download: string;
    upload: string;
    price: number;
    guaranteedSpeed: string;
    priority: string;
    burstLimit: string;
    burstThreshold: string;
    burstTime: string;
    status: number;
}