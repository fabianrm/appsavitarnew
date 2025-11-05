import { Customer } from "./CustomerResponse";

export interface Historical {
    customer: Customer;
    services: ServiceElement[];
    tickets: any[];
}

export interface ServiceElement {
    service: Service;
    invoices: Invoice[];
    suspensions: Suspension[];
}

export interface Invoice {
    invoiceId: number;
    serviceId: number;
    contractId: string;
    string: string;
    address: string;
    planName: string;
    price: string;
    igv: string;
    discount: string;
    amount: string;
    letterAmount: null;
    startDate: Date;
    endDate: Date;
    dueDate: Date;
    paidDated: Date | null;
    receipt: string;
    tipoPago: string | null;
    note: null | string;
    periodic: string;
    status: string;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
}



export interface Service {
    id: number;
    serviceCode: string;
    string: string;
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
    installationPayment: number;
    installationAmount: null;
    prepayment: number;
    latitude: string;
    longitude: string;
    coordinates: string[];
    billingDate: null;
    dueDate: null;
    endDate: null;
    userPppoe: null;
    passPppoe: null;
    iptv: number;
    userIptv: null;
    passIptv: null;
    observation: null;
    promotion: Promotion;
    status: string;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
}

export interface Promotion {
    id: string;
    name: string;
}

export interface Suspension {
    id: number;
    enterprise_id: number;
    start_date: Date;
    end_date: Date;
    reason: string;
    observation: string;
    updated_by: number;
    updated_at: Date;
    created_at: Date;
    reactivation_date: Date;
    status: string;
}
