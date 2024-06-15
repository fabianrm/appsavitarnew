export interface EquipmentResponse {
    data: Equipment[];
}

export interface Equipment {
    id: number;
    type: string;
    serie: string;
    model: string;
    brand: string;
    brandId: number;
    purchaseDate: Date;
    status: string;
}
