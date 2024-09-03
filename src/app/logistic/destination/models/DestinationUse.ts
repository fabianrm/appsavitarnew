export interface DestinationUseResponse {
    data: DestineUse[];
}

export interface DestinationUseSingleResponse {
    data: DestineUse;
}

export interface DestineUse {
    date: Date;
    code: string;
    name: string;
    presentation: string;
    model: string;
    brand: string;
    quantity: number;
    subtotal: number;
}
