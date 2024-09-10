export interface TicketRequest {
    category_ticket_id: number;
    subject: string;
    description: string;
    customer_id: number;
    technician_id: null;
    admin_id: number;
    assigned_at: null;
    resolved_at: null;
    closed_at: null;
    status: string;
}
