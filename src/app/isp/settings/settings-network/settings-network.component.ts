import { Component, OnInit } from '@angular/core';
import { RouterService, VpnScriptResponse } from '../../router/router.service';
import { ReqRouter } from '../../router/Models/ResponseRouter';

interface RouterVpnState {
  loading: boolean;
  error: string | null;
  script: string | null;
  copied: boolean;
}

@Component({
  selector: 'app-settings-network',
  templateUrl: './settings-network.component.html',
  styleUrl: './settings-network.component.css',
  standalone: false
})
export class SettingsNetworkComponent implements OnInit {

  routers: ReqRouter[] = [];
  loading = true;
  error = false;

  expandedRouterId: number | null = null;
  vpnState: Record<number, RouterVpnState> = {};

  constructor(private routerService: RouterService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = false;
    this.routerService.getRouters().subscribe({
      next: (res) => {
        this.loading = false;
        this.routers = res.data ?? res;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      },
    });
  }

  vpnConfigured(router: ReqRouter): boolean {
    return !!router.wg_public_key;
  }

  statusLabel(router: ReqRouter): string {
    switch (router.connectivity?.status) {
      case 'online': return 'Conectado';
      case 'offline': return 'Sin conexión';
      case 'no_monitoreado': return 'Sin monitoreo';
      default: return 'Verificando...';
    }
  }

  statusClass(router: ReqRouter): string {
    return 'status-' + (router.connectivity?.status ?? 'desconocido');
  }

  toggleRow(router: ReqRouter): void {
    this.expandedRouterId = this.expandedRouterId === router.id ? null : router.id;
    if (!this.vpnState[router.id]) {
      this.vpnState[router.id] = { loading: false, error: null, script: null, copied: false };
    }
  }

  private stateFor(id: number): RouterVpnState {
    if (!this.vpnState[id]) {
      this.vpnState[id] = { loading: false, error: null, script: null, copied: false };
    }
    return this.vpnState[id];
  }

  provisionVpn(router: ReqRouter): void {
    const state = this.stateFor(router.id);
    state.loading = true;
    state.error = null;
    this.routerService.provisionVpn(router.id).subscribe({
      next: (res: VpnScriptResponse) => {
        state.loading = false;
        if (res.success) {
          state.script = res.script ?? null;
          this.load();
        } else {
          state.error = res.message ?? 'No se pudo configurar la VPN.';
        }
      },
      error: (err) => {
        state.loading = false;
        state.error = err?.error?.message ?? 'No se pudo configurar la VPN.';
      },
    });
  }

  showVpnScript(router: ReqRouter): void {
    const state = this.stateFor(router.id);
    state.loading = true;
    state.error = null;
    this.routerService.getVpnScript(router.id).subscribe({
      next: (res: VpnScriptResponse) => {
        state.loading = false;
        state.script = res.success ? (res.script ?? null) : null;
        if (!res.success) {
          state.error = res.message ?? 'No se pudo obtener el script.';
        }
      },
      error: (err) => {
        state.loading = false;
        state.error = err?.error?.message ?? 'No se pudo obtener el script.';
      },
    });
  }

  copyVpnScript(router: ReqRouter): void {
    const state = this.stateFor(router.id);
    if (!state.script) return;
    navigator.clipboard.writeText(state.script).then(() => {
      state.copied = true;
      setTimeout(() => (state.copied = false), 3000);
    });
  }
}
