import { User } from "../../../auth/Models/UserResponse";
import { Customer } from "../../../isp/customer/Models/CustomerResponseU";
import { Destination } from "../../../logistic/destination/models/DestinationResponse";

import { CategoryTicket } from "../../category-ticket/Models/CategoryTicketResponse";


export interface TicketResponse {
    data: Ticket[];
    total: number;
}

export interface TicketSingleResponse {
    data: Ticket;
}

export interface Ticket {
    id: number;
    code: string;
    subject: string;
    description: string;
    category: CategoryTicket;
    customer: Customer;
    technician?: User;
    admin: User;
    assigned_at: null;
    resolved_at: null;
    closed_at: null;
    status: string;
    priority: string;
    expiration: string;
    created_at: Date;
    updated_at: Date;
    history: History[];
    project: Destination;
    attachments: Attachment[];
}


export interface History {
    id: number;
    ticket_id: number;
    changed_by?: User;
    comment?: string;
    updated_at: Date;
    status: string;
}

export interface Attachment {
    id: number;
    ticket_id: number;
    file_path: string;
    created_at: Date;
    updated_at: Date;
}
