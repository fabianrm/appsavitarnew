export interface CustomerResponseU {
    data: Customer;
}

export interface Customer {
    id: number;
    type: string;
    customerCode: string;
    documentNumber: string;
    customerName: string;
    city: string;
    cityId: number;
    address: string;
    reference: string;
    latitude: number;
    longitude: number;
    coordinates: [number, number];
    phoneNumber: string;
    whatsapp: string;
    email: string;
    status: boolean;
    updated_at: Date;
    totalContracts: number;
    service?: Service[];
}

export interface Service {
    id: number;
    enterprise_id: number;
    serviceCode: string;
    customerName: string;
    planName: string;
    routerId: number;
    routerIp: string;
    vlan: string;
    boxName: string;
    portNumber: string;
    equipmentId: number;
    equipmentSerie: string;
    city: string;
    addressInstallation: string;
    reference: string;
    registrationDate: Date;
    installationDate: Date;
    latitude: string;
    longitude: string;
    billingDate: null;
    dueDate: null;
    endDate: null;
    userPppoe: string;
    passPppoe: string;
    observation: null;
    status: string;
}
