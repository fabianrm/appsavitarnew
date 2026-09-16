import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Chart from 'chart.js/auto';
import { RouterService } from '../router.service';
import { RouterMetricsResponse } from '../Models/RouterMetricsResponse';

@Component({
  selector: 'app-router-detail',
  templateUrl: './router-detail.component.html',
  styleUrl: './router-detail.component.css',
  standalone: false
})
export class RouterDetailComponent implements OnInit, OnDestroy {

  @ViewChild('cpuChart') cpuChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('memChart') memChartRef!: ElementRef<HTMLCanvasElement>;

  routerId!: number;
  data?: RouterMetricsResponse;
  loading = true;
  error = false;

  private cpuChartInstance?: Chart;
  private memChartInstance?: Chart;

  constructor(private route: ActivatedRoute, private routerService: RouterService) {}

  ngOnInit(): void {
    this.routerId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  ngOnDestroy(): void {
    this.cpuChartInstance?.destroy();
    this.memChartInstance?.destroy();
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
