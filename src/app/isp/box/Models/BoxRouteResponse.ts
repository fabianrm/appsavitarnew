export interface BoxRouteResponse {
  data: BoxRoute[]; // Assuming standard API response wrapper
  message?: string;
}

export interface BoxRoute {
  id?: number;
  start_box_id: number;
  end_box_id: number;
  color: string;
  points: any; // Can be string (JSON) or array depending on parsing
  distance?: number;
  status: string;
  city_id: number;
  created_at?: string;
  updated_at?: string;
}
