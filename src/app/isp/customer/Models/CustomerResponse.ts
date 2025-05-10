export interface CustomerResponse {
    data: Customer[];
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
