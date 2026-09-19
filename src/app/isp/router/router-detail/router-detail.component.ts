import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Chart from 'chart.js/auto';
import { RouterService, RouterInterface } from '../router.service';
import { RouterMetricsResponse } from '../Models/RouterMetricsResponse';

const TRAFFIC_POLL_MS = 2000;
const TRAFFIC_RETRY_MS = 3000;
const TRAFFIC_WINDOW = 30;

@Component({
  selector: 'app-router-detail',
  templateUrl: './router-detail.component.html',
  styleUrl: './router-detail.component.css',
  standalone: false
})
export class RouterDetailComponent implements OnInit, OnDestroy {

  @ViewChild('cpuChart') cpuChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('memChart') memChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('trafficChart') trafficChartRef?: ElementRef<HTMLCanvasElement>;

  routerId!: number;
  data?: RouterMetricsResponse;
  loading = true;
  error = false;

  liveChecking = false;
  liveJustChecked = false;

  interfaces: RouterInterface[] = [];
  interfacesLoading = false;
  interfacesError = false;
  selectedInterface: string | null = null;
  trafficActive = false;
  trafficError = false;
  currentTraffic?: { rx_bps: number; tx_bps: number };

  private cpuChartInstance?: Chart;
  private memChartInstance?: Chart;
  private trafficChartInstance?: Chart;
  private trafficTimer: any;
  private trafficPollId = 0;
  private trafficLabels: string[] = [];
  private trafficRx: number[] = [];
  private trafficTx: number[] = [];

  constructor(private route: ActivatedRoute, private routerService: RouterService) {}

  ngOnInit(): void {
    this.routerId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
    this.loadInterfaces();
  }

  ngOnDestroy(): void {
    this.stopTrafficPolling();
    this.cpuChartInstance?.destroy();
    this.memChartInstance?.destroy();
    this.trafficChartInstance?.destroy();
  }

  loadInterfaces(): void {
    this.interfacesLoading = true;
    this.interfacesError = false;
    this.routerService.getRouterInterfaces(this.routerId).subscribe({
      next: (res) => {
        this.interfacesLoading = false;
        this.interfaces = res.data;
      },
      error: () => {
        this.interfacesLoading = false;
        this.interfacesError = true;
      },
    });
  }

  onInterfaceChange(name: string): void {
    this.stopTrafficPolling();
    this.selectedInterface = name;
    if (name) {
      this.startTrafficPolling();
    }
  }

  private startTrafficPolling(): void {
    this.trafficLabels = [];
    this.trafficRx = [];
    this.trafficTx = [];
    this.currentTraffic = undefined;
    this.trafficError = false;
    this.trafficActive = true;
    this.trafficPollId++;
    this.pollTraffic(this.trafficPollId);
  }

  stopTrafficPolling(): void {
    this.trafficActive = false;
    this.trafficPollId++;
    if (this.trafficTimer) {
      clearTimeout(this.trafficTimer);
      this.trafficTimer = undefined;
    }
  }

  private pollTraffic(pollId: number): void {
    if (!this.selectedInterface) return;

    this.routerService.getRouterTraffic(this.routerId, this.selectedInterface).subscribe({
      next: (t) => {
        if (pollId !== this.trafficPollId) return;
        this.trafficError = false;
        this.currentTraffic = { rx_bps: t.rx_bps, tx_bps: t.tx_bps };
        this.pushTrafficPoint(t.rx_bps, t.tx_bps);
        this.trafficTimer = setTimeout(() => this.pollTraffic(pollId), TRAFFIC_POLL_MS);
      },
      error: () => {
        if (pollId !== this.trafficPollId) return;
        this.trafficError = true;
        this.trafficTimer = setTimeout(() => this.pollTraffic(pollId), TRAFFIC_RETRY_MS);
      },
    });
  }

  private pushTrafficPoint(rxBps: number, txBps: number): void {
    this.trafficLabels.push(new Date().toLocaleTimeString('es-PE'));
    this.trafficRx.push(Math.round((rxBps / 1_000_000) * 10) / 10);
    this.trafficTx.push(Math.round((txBps / 1_000_000) * 10) / 10);

    if (this.trafficLabels.length > TRAFFIC_WINDOW) {
      this.trafficLabels.shift();
      this.trafficRx.shift();
      this.trafficTx.shift();
    }

    this.updateTrafficChart();
  }

  formatMbps(bps?: number): string {
    if (!bps) return '0.0';
    return (bps / 1_000_000).toFixed(1);
  }

  private updateTrafficChart(): void {
    if (!this.trafficChartRef) return;

    if (!this.trafficChartInstance) {
      this.trafficChartInstance = new Chart(this.trafficChartRef.nativeElement, {
        type: 'line',
        data: {
          labels: this.trafficLabels,
          datasets: [
            {
              label: 'RX (Mbps)',
              data: this.trafficRx,
              borderColor: 'rgb(54, 162, 235)',
              backgroundColor: 'rgba(54, 162, 235, 0.15)',
              fill: true,
              tension: 0.3,
              pointRadius: 0,
            },
            {
              label: 'TX (Mbps)',
              data: this.trafficTx,
              borderColor: 'rgb(255, 159, 64)',
              backgroundColor: 'rgba(255, 159, 64, 0.15)',
              fill: true,
              tension: 0.3,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          animation: false,
          scales: { y: { beginAtZero: true } },
          plugins: { legend: { display: true, position: 'bottom' } },
        },
      });
      return;
    }

    this.trafficChartInstance.data.labels = this.trafficLabels;
    this.trafficChartInstance.data.datasets[0].data = this.trafficRx;
    this.trafficChartInstance.data.datasets[1].data = this.trafficTx;
    this.trafficChartInstance.update();
  }

  load(): void {
    this.loading = true;
    this.error = false;
    this.routerService.getRouterMetrics(this.routerId).subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
        setTimeout(() => this.buildCharts());
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }

  liveCheck(): void {
    this.liveChecking = true;
    this.liveJustChecked = false;
    this.routerService.getRouterLiveCheck(this.routerId).subscribe({
      next: (res) => {
        this.liveChecking = false;
        this.applyLiveCheck(res.connectivity.status === 'online', res.latest);
      },
      error: () => {
        this.liveChecking = false;
        this.applyLiveCheck(false, null);
      },
    });
  }

  private applyLiveCheck(isUp: boolean, latest: { cpu_load: number; mem_used: number; mem_total: number; disk_used: number; disk_total: number; uptime: string | null } | null): void {
    if (!this.data) return;

    this.data.connectivity = { status: isUp ? 'online' : 'offline', checked_at: new Date().toISOString() };

    if (latest) {
      this.data.latest = {
        ...(this.data.latest ?? { id: 0, router_id: this.routerId, recorded_at: '' }),
        ...latest,
        recorded_at: new Date().toISOString(),
      };
    }

    this.liveJustChecked = true;
    setTimeout(() => (this.liveJustChecked = false), 4000);
  }

  statusLabel(): string {
    switch (this.data?.connectivity?.status) {
      case 'online':
        return 'Up';
      case 'offline':
        return 'Down';
      case 'no_monitoreado':
        return 'Sin monitoreo';
      default:
        return 'Verificando...';
    }
  }

  statusClass(): string {
    return 'status-' + (this.data?.connectivity?.status ?? 'desconocido');
  }

  cpuPercent(): number {
    return this.data?.latest?.cpu_load ?? 0;
  }

  memPercent(): number {
    const l = this.data?.latest;
    if (!l || !l.mem_total) return 0;
    return Math.round((l.mem_used / l.mem_total) * 100);
  }

  diskPercent(): number {
    const l = this.data?.latest;
    if (!l || !l.disk_total) return 0;
    return Math.round((l.disk_used / l.disk_total) * 100);
  }

  formatBytes(bytes?: number): string {
    if (!bytes) return '0 GB';
    return (bytes / 1024 / 1024 / 1024).toFixed(1) + ' GB';
  }

  vpnConfigured(): boolean {
    return !!this.data?.router?.wg_public_key;
  }

  formatUptime(uptime?: string | null): string {
    if (!uptime) return '-';
    const match = uptime.match(/(\d+w)?(\d+d)?(\d+h)?(\d+m)?(\d+s)?/);
    if (!match) return uptime;
    return match.slice(1).filter(Boolean).join(' ') || uptime;
  }

  private buildCharts(): void {
    const history = this.data?.history ?? [];
    if (!history.length) return;

    const labels = history.map((h) =>
      new Date(h.recorded_at).toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    );

    this.cpuChartInstance?.destroy();
    this.memChartInstance?.destroy();

    if (this.cpuChartRef) {
      this.cpuChartInstance = new Chart(this.cpuChartRef.nativeElement, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'CPU %',
            data: history.map((h) => h.cpu_load),
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.15)',
            fill: true,
            tension: 0.3,
            pointRadius: 0,
          }],
        },
        options: {
          responsive: true,
          scales: { y: { min: 0, max: 100 } },
          plugins: { legend: { display: false } },
        },
      });
    }

    if (this.memChartRef) {
      this.memChartInstance = new Chart(this.memChartRef.nativeElement, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Memoria %',
            data: history.map((h) => Math.round((h.mem_used / h.mem_total) * 100)),
            borderColor: 'rgb(75, 192, 129)',
            backgroundColor: 'rgba(75, 192, 129, 0.15)',
            fill: true,
            tension: 0.3,
            pointRadius: 0,
          }],
        },
        options: {
          responsive: true,
          scales: { y: { min: 0, max: 100 } },
          plugins: { legend: { display: false } },
        },
      });
    }
  }
}
