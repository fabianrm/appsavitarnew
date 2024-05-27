export interface ServiceResponse {
    data: Service[];
}

export interface Service {
    id: number;
    serviceCode: string;
    customerName: string;
    planName: string;
    routerIp: string;
    boxName: string;
    portNumber: string;
    equipmentSerie: string;
    city: string;
    addressInstallation: string;
    reference: string;
    registrationDate: Date;
    installationDate: Date;
    latitude: string;
    longitude: string;
    billingDate: string;
    dueDate: string;
    status: string;
    endDate: null;
}
