import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { merge, startWith, Subscription } from 'rxjs';
import { EnterpriseService } from '../../enterprise/enterprise.service';
import { WhatsappFailure } from './whatsapp-failure';

@Component({
  selector: 'app-settings-whatsapp-failures',
  templateUrl: './settings-whatsapp-failures.component.html',
  styleUrl: './settings-whatsapp-failures.component.css',
  standalone: false,
  animations: [
    trigger('slideInOut', [
      state('true', style({ height: '*', opacity: 1 })),
      state('false', style({ height: '0px', opacity: 0 })),
      transition('true <=> false', animate('300ms ease-in-out')),
    ]),
  ],
})
export class SettingsWhatsappFailuresComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['customerName', 'phone', 'type', 'errorMessage', 'createdAt', 'status', 'acciones'];
  dataSource = new MatTableDataSource<WhatsappFailure>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private subscription = new Subscription();

  totalFailures = 0;
  isLoadingResults = false;
  isFilterVisible = false;
  resolvingId: number | null = null;

  filterStatus: string | null = 'pending';
  filterType: string | null = null;

  constructor(
    private enterpriseService: EnterpriseService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getFailures();
  }

  ngAfterViewInit(): void {
    this.subscription.add(
      merge(this.paginator.page)
        .pipe(startWith({}))
        .subscribe(() => this.getFailures()),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private buildFilters() {
    return {
      status: this.filterStatus ?? undefined,
      type: this.filterType ?? undefined,
      page: (this.paginator?.pageIndex ?? 0) + 1,
      perPage: this.paginator?.pageSize ?? 10,
    };
  }

  getFailures(): void {
    this.isLoadingResults = true;
    this.enterpriseService.getWhatsappFailures(this.buildFilters()).subscribe({
      next: (respuesta) => {
        this.isLoadingResults = false;
        this.totalFailures = respuesta.meta?.total ?? respuesta.data.length;
        this.dataSource.data = respuesta.data ?? [];
      },
      error: () => {
        this.isLoadingResults = false;
      },
    });
  }

  toggleFilters(): void {
    this.isFilterVisible = !this.isFilterVisible;
  }

  applyFilters(): void {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.getFailures();
  }

  clearFilters(): void {
    this.filterStatus = 'pending';
    this.filterType = null;

    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.getFailures();
  }

  resolve(row: WhatsappFailure): void {
    this.resolvingId = row.id;
    this.enterpriseService.resolveWhatsappFailure(row.id).subscribe({
      next: () => {
        this.resolvingId = null;
        this.snackBar.open('Marcado como resuelto', 'Cerrar', { duration: 3000 });
        this.getFailures();
      },
      error: () => {
        this.resolvingId = null;
        this.snackBar.open('No se pudo marcar como resuelto', 'Cerrar', { duration: 4000 });
      },
    });
  }
}
