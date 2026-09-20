export interface CustomerResponse {
    data: Customer[];
    meta?: {
        current_page: number;
        from: number | null;
        last_page: number;
        per_page: number;
        to: number | null;
        total: number;
    };
}

export interface Customer {
    id: number;
    type: string;
    customerCode: string;
    customerName: string;
    documentNumber: string;
    city: string;
    cityId: number;
    address: string;
    reference: string;
    latitude: string;
    longitude: string;
    phoneNumber: string;
    whatsapp: string;
    email: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    totalContracts: number;
}
