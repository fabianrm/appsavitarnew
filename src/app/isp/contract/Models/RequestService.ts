export interface RequestService {
    customerId: number;
    planId: number;
    routerId: number;
    boxId: number;
    portNumber: number;
    equipmentId: number;
    cityId: number;
    addressInstallation: string;
    reference: string;
    registrationDate: Date;
    installationDate: Date;
    latitude: string;
    longitude: string;
    billingDate: string;
    dueDate: string;
    status: string;
    endDate: string;
}