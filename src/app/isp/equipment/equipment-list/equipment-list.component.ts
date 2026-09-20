import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { formatDate } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, startWith, Subscription } from 'rxjs';
import { EquipmentService } from './../equipment.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EquipmentCreateComponent } from '../equipment-create/equipment-create.component';
import { EquipmentEditComponent } from '../equipment-edit/equipment-edit.component';
import { Equipment } from '../Models/EquipmentResponse';
import { BrandService } from '../../brand/brand.service';
import { Brand } from '../../brand/Models/BrandResponse';

interface Option {
  value: string;
  viewValue: string;
}

@Component({
    selector: 'app-equipment-list',
    templateUrl: './equipment-list.component.html',
    styleUrl: './equipment-list.component.scss',
    standalone: false,
    animations: [
      trigger('slideInOut', [
        state('true', style({ height: '*', opacity: 1 })),
        state('false', style({ height: '0px', opacity: 0 })),
        transition('true <=> false', animate('300ms ease-in-out')),
      ]),
    ],
})
export class EquipmentListComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns: string[] = ['id', 'type', 'mac', 'serie', 'model', 'brand', 'purchaseDate', 'contractCode', 'status', 'acciones'];

  public dataSource: MatTableDataSource<Equipment> = new MatTableDataSource<Equipment>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta: Equipment[] = [];

  eqSelected: any;

  brands: Brand[] = [];
  totalEquipments = 0;
  isLoadingResults = false;
  isFilterVisible = false;

  // true una vez que el usuario aplica un filtro -- mientras esté en false
  // se muestra la ventana por defecto (último mes de equipos registrados)
  // en vez de traer las 900+ filas de una sola vez.
  private usingDefaultView = true;

  filterMac = '';
  filterType: string | null = null;
  filterBrandId: number | null = null;
  filterStatus: string | null = null;
  filterPurchaseDateFrom: Date | null = null;
  filterPurchaseDateTo: Date | null = null;

  tipos: Option[] = [
    { value: 'ROUTER', viewValue: 'ROUTER' },
    { value: 'SWITCH', viewValue: 'SWITCH' },
  ];

  estados: Option[] = [
    { value: 'BUENO', viewValue: 'BUENO' },
    { value: 'REGULAR', viewValue: 'REGULAR' },
    { value: 'MALO', viewValue: 'MALO' },
  ];

  constructor(
    private equipmentService: EquipmentService,
    private brandService: BrandService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.getBrands();
    this.getEquipments();

    this.subscription = this.equipmentService.refresh$.subscribe(() => {
      this.getEquipments()
    })
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.subscription.add(
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(startWith({}))
        .subscribe(() => this.getEquipments()),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getBrands() {
    this.brandService.getBrands().subscribe((respuesta) => {
      this.brands = respuesta.data ?? [];
    });
  }

  private buildFilters() {
    let createdFrom: string | undefined;
    let createdTo: string | undefined;

    if (this.usingDefaultView) {
      const today = new Date();
      const lastMonth = new Date();
      lastMonth.setDate(lastMonth.getDate() - 30);
      createdFrom = formatDate(lastMonth, 'yyyy-MM-dd', 'en-US');
      createdTo = formatDate(today, 'yyyy-MM-dd', 'en-US');
    }

    return {
      mac: this.filterMac?.trim() || undefined,
      type: this.filterType ?? undefined,
      brandId: this.filterBrandId ?? undefined,
      status: this.filterStatus ?? undefined,
      purchaseDateFrom: this.filterPurchaseDateFrom ? formatDate(this.filterPurchaseDateFrom, 'yyyy-MM-dd', 'en-US') : undefined,
      purchaseDateTo: this.filterPurchaseDateTo ? formatDate(this.filterPurchaseDateTo, 'yyyy-MM-dd', 'en-US') : undefined,
      createdFrom,
      createdTo,
      page: (this.paginator?.pageIndex ?? 0) + 1,
      perPage: this.paginator?.pageSize ?? 10,
    };
  }

  // Reinicia a la primera página y vuelve a consultar con los filtros actuales
  applyFilters() {
    this.usingDefaultView = false;

    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.getEquipments();
  }

  toggleFilters() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  clearFilters() {
    this.filterMac = '';
    this.filterType = null;
    this.filterBrandId = null;
    this.filterStatus = null;
    this.filterPurchaseDateFrom = null;
    this.filterPurchaseDateTo = null;
    this.usingDefaultView = true;

    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.getEquipments();
  }

  getEquipments() {
    this.isLoadingResults = true;
    this.equipmentService.getEquipmentsList(this.buildFilters()).subscribe({
      next: (respuesta) => {
        this.isLoadingResults = false;
        this.totalEquipments = respuesta.meta?.total ?? respuesta.data.length;
        this.dataSource.data = respuesta.data ?? [];
        this.respuesta = respuesta.data ?? [];
      },
      error: () => {
        this.isLoadingResults = false;
      },
    });
  }

  openDialog(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
   // dialogConfig.width = '40%';
    this.dialog.open(EquipmentCreateComponent, dialogConfig);

    this.dialog.afterAllClosed.subscribe(() => {
    })
  }



  openDialogEdit(id: number) {

    if (this.respuesta.length > 0) {
      this.eqSelected = this.respuesta.filter(equipment => equipment.id == id);
    }

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
   // dialogConfig.width = '40%';
    dialogConfig.data = this.eqSelected;
    this.dialog.open(EquipmentEditComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { })
  }

  delete(id:number) {}


}
