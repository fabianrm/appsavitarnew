export interface CustomerResponse {
    data: Customer[];
}

export interface Customer {
    id: number;
    type: string;
    customerCode: string;
    customerName: string;
    documentNumber: string;
    name: string;
    city: string;
    address: string;
    reference: string;
    latitude: string;
    longitude: string;
    phoneNumber: string;
    email: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    totalContracts: number;
}
