export interface WhatsappFailure {
  id: number;
  invoiceId: number | null;
  customerName: string;
  phone: string;
  type: 'due' | 'overdue';
  errorMessage: string | null;
  status: 'pending' | 'resolved';
  resolvedAt: string | null;
  resolvedByName: string | null;
  createdAt: string;
}

export interface WhatsappFailureResponse {
  data: WhatsappFailure[];
  meta?: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}
