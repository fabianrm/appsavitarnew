export interface ServiceResponse {
    data: Service[];
}

export interface ServiceSingleResponse {
    data: Service;
}

export interface Service {
    id: number;
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
    status: string;
    endDate: null;
    userPppoe: string;
    passPppoe: string;
}
