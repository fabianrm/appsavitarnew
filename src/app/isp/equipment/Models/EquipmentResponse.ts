export interface EquipmentResponse {
    data: Equipment[];
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
