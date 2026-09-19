import { RouterConnectivity } from './ResponseRouter';

export interface RouterMetricSample {
  cpu_load: number;
  mem_used: number;
  mem_total: number;
  disk_used: number;
  disk_total: number;
  recorded_at: string;
}

export interface RouterMetricLatest extends RouterMetricSample {
  id: number;
  router_id: number;
  uptime: string | null;
}

export interface RouterMetricsResponse {
  router: { id: number; ip: string; wg_public_key: string | null; wg_provisioned_at: string | null };
  connectivity: RouterConnectivity;
  latest: RouterMetricLatest | null;
  history: RouterMetricSample[];
}

export interface RouterLiveCheck {
  connectivity: RouterConnectivity;
  latest: {
    cpu_load: number;
    mem_used: number;
    mem_total: number;
    disk_used: number;
    disk_total: number;
    uptime: string | null;
  } | null;
}
