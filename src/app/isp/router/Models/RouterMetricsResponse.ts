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
  router: { id: number; ip: string };
  connectivity: RouterConnectivity;
  latest: RouterMetricLatest | null;
  history: RouterMetricSample[];
}
