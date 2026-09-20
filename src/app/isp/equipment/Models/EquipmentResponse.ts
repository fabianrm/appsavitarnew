export interface EquipmentResponse {
    data: Equipment[];
    meta?: {
        current_page: number;
        from: number | null;
        last_page: number;
        per_page: number;
        to: number | null;
        total: number;
    };
}

export interface Equipment {
    id: number;
    type: string;
    mac: string;
    serie: string;
    model: string;
    brand: string;
    brandId: number;
    purchaseDate: Date;
    contractCode: string;
    status: string;
}
