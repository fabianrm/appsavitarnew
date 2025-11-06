import { Customer } from "./CustomerResponse";

export interface Historical {
    customer: Customer;
    services: ServiceElement[];
    tickets: Ticket[];
}



export interface ServiceElement {
    service: ServiceService;
    invoices: Invoice[];
    suspensions: any[];
}

export interface Invoice {
    invoiceId: number;
    serviceId: number;
    contractId: string;
    customerName: string;
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
    tipoPago: null | string;
    note: null | string;
    periodic: string;
    status: string;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
}

export interface ServiceService {
    id: number;
    serviceCode: string;
    customerName: string;
    planName: string;
    planId: number;
    routerId: number;
    routerIp: string;
    vlan: string;
    boxName: string;
    portNumber: null;
    equipmentId: null;
    equipmentSerie: null;
    equipmentMac: null;
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
    endDate: Date;
    userPppoe: null;
    passPppoe: null;
    iptv: number;
    userIptv: null;
    passIptv: null;
    observation: string;
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

export interface Ticket {
    id: number;
    code: string;
    subject: string;
    description: string;
    priority: string;
    expiration: Date;
    assigned_at: Date;
    resolved_at: null;
    closed_at: null;
    status: string;
    created_at: Date;
    updated_at: Date;
    history: History[];
}

export interface History {
    id: number;
    ticket_id: number;
    comment: string;
    updated_at: Date;
    status: string;
}
