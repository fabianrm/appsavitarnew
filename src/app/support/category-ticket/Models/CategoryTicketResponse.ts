export interface CategoryTicketResponse {
    data: CategoryTicket[];
    total: number;
}

export interface CategoryTicketSingleResponse {
    data: CategoryTicket;
}

export interface CategoryTicket {
    id: number;
    name: string;
    description: string;
    status: number;
    created_at: null;
    updated_at: null;
}
