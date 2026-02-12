export interface BoxRoutePhoto {
  id: number;
  box_route_id: number;
  path: string;
  created_at: string;
  updated_at: string;
}

export interface BoxRoutePhotoResponse {
  data?: BoxRoutePhoto;
}
