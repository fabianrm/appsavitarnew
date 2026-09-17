export interface ServiceResponse {
    data: Service[];
    links?: ServiceLinks;
    meta?: ServiceMeta;
}

export interface ServiceLinks {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

export interface ServiceMeta {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
}

export interface ServiceSingleResponse {
    data: Service;
}

export interface Service {
    id: number;
    serviceCode: string;
    customerName: string;
    planName: string;
    planId: number;
    routerId: number;
    routerIp: string;
    vlan: string;
    boxName: string;
    portNumber: string;
    equipmentId: number;
    equipmentSerie: string;
    equipmentMac: string;
    cityId: number;
    city: string;
    addressInstallation: string;
    reference: string;
    registrationDate: Date;
    installationDate: Date;
    installationPayment: boolean,
    installationAmount: number,
    prepayment: boolean,
    latitude: number;
    longitude: number;
    coordinates: [number, number];
    billingDate: null;
    dueDate: null;
    status: string;
    endDate: null;
    userPppoe: string;
    passPppoe: string;
    iptv: boolean;
    userIptv: string;
    passIptv: string;
    promotion?: Promotion
}

interface Promotion {
    id?: number;
    name?: number;
}