export interface NotificationData {
  ticket_id: string | number;
  subject: string;
  description: string;
  status: string;
  customer_id: string | number | null;
  message: string;
}

export interface AppNotification {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number | string;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedNotifications {
  current_page: number;
  data: AppNotification[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
