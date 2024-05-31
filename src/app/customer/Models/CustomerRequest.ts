export interface CustomerRequest {
    type: string;
    documentNumber: string;
    name: string;
    cityId: number;
    address: string;
    reference: string;
    latitude: string;
    longitude: string;
    phoneNumber: string;
    email: string;
    status: boolean;
}
