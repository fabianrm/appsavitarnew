import { User } from "../../../auth/Models/UserResponse";
import { Customer } from "../../../isp/customer/Models/CustomerResponseU";

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
    created_at: Date;
    updated_at: Date;
    history: History[];
}


export interface History {
    id: number;
    ticket_id: number;
    changed_by?: User;
    comment?: string;
    updated_at: Date;
    status: string;
}