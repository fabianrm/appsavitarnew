export interface CustomerResponseU {
    data: Customer;
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
    latitude: number;
    longitude: number;
    phoneNumber: string;
    email: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    totalContracts: number;
}
