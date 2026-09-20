import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  Subscription,
  Subject,
  merge,
  startWith,
  debounceTime,
} from 'rxjs';
import { formatDate } from '@angular/common';
import { ContractService } from '../contract.service';
import { ContractEditPlanComponent } from '../contract-edit-plan/contract-edit-plan.component';
import { Service } from '../Models/ServiceResponse';
import { ChangePortComponent } from '../change-port/change-port.component';
import { ContractSuspendComponent } from '../contract-suspend/contract-suspend.component';
import { ChangeEquipmentComponent } from '../change-equipment/change-equipment.component';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { ChangeVlanComponent } from '../change-vlan/change-vlan.component';
import { ChangeUserComponent } from '../change-user/change-user.component';
import { SuspensionService } from '../../suspension/suspension.service';
import { AddPromoComponent } from '../add-promo/add-promo.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { RouterService } from '../../router/router.service';
import { TestResponse } from '../../router/Models/TestResponse';
import { ChangeIptvComponent } from '../change-iptv/change-iptv.component';
import { PlanService } from '../../plan/plan.service';
import { CityService } from '../../city/city.service';
import { PromotionService } from '../../promotion/promotion.service';
import { ReqPlan } from '../../plan/Models/ResponsePlan';
import { City } from '../../city/Models/CityResponse';
import { Promotion } from '../../promotion/models';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrl: './contract-list.component.scss',
  standalone: false,
  animations: [
    trigger('slideInOut', [
      state('true', style({ height: '*', opacity: 1 })),
      state('false', style({ height: '0px', opacity: 0 })),
      transition('true <=> false', animate('300ms ease-in-out')),
    ]),
  ],
})
export class ContractListComponent implements OnInit, AfterViewInit, OnDestroy {
  availableColumns: string[] = [
    'id',
    'serviceCode',
    'customerName',
    'planName',
    'installationDate',
    'city',
    'addressInstallation',
    'latitude',
    'longitude',
    'promotion',
    'status',
    'createdBy',
    'updatedBy',
    'updatedAt',
    'acciones',
  ];

  displayedColumns: string[] = [
    'serviceCode',
    'customerName',
    'planName',
    'installationDate',
    'city',
    'addressInstallation',
    'promotion',
    'status',
    'acciones',
  ];

  public dataSource = new MatTableDataSource<Service>();
  totalContracts = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @ViewChild(MatMenuTrigger) columnasMenuTrigger!: MatMenuTrigger;

  subscription = new Subscription();

  public respuesta!: Service[];
  public contrato!: Service[];
  statusMK: string = '---';

  // Filtros
  isFilterVisible = false;
  code: string = '';
  customerName: string = '';
  planId: number | null = null;
  cityId: number | null = null;
  promotionId: number | null = null;
  rangoFechas = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  plans: ReqPlan[] = [];
  cities: City[] = [];
  promotions: Promotion[] = [];

  private filterChange$ = new Subject<void>();

  constructor(
    private contractService: ContractService,
    private suspensionService: SuspensionService,
    private routerService: RouterService,
    private planService: PlanService,
    private cityService: CityService,
    private promotionService: PromotionService,
    public dialog: MatDialog,
    private router: Router,
    private snackbarService: SnackbarService,
  ) {}

  // true una vez que el usuario modifica el rango de fechas por su cuenta
  private dateRangeTouched = false;

  ngOnInit() {
    const today = new Date();
    this.rangoFechas.setValue({ start: today, end: today }, { emitEvent: false });

    this.getPlans();
    this.getCities();
    this.getPromotions();

    this.subscription.add(
      this.rangoFechas.valueChanges
        .pipe(debounceTime(300))
        .subscribe(() => {
          this.dateRangeTouched = true;
          this.searchContracts();
        }),
    );

    this.subscription.add(
      this.filterChange$
        .pipe(debounceTime(400))
        .subscribe(() => this.searchContracts()),
    );

    this.subscription.add(
      this.contractService.refresh$.subscribe(() => {
        this.getContracts();
      }),
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.subscription.add(
      merge(this.sort.sortChange, this.paginator.page)
        .pipe(startWith({}))
        .subscribe(() => this.getContracts()),
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private buildFilters() {
    const { start, end } = this.rangoFechas.value;

    return {
      dateFrom: start ? formatDate(start, 'yyyy-MM-dd', 'en-US') : undefined,
      dateTo: end ? formatDate(end, 'yyyy-MM-dd', 'en-US') : undefined,
      code: this.code?.trim() || undefined,
      customer: this.customerName?.trim() || undefined,
      planId: this.planId ?? undefined,
      cityId: this.cityId ?? undefined,
      promotionId: this.promotionId ?? undefined,
      page: (this.paginator?.pageIndex ?? 0) + 1,
      perPage: this.paginator?.pageSize ?? 10,
    };
  }

  getContracts() {
    this.isLoadingResults = true;
    this.contractService.getservices(this.buildFilters()).subscribe({
      next: (respuesta) => {
        this.isLoadingResults = false;
        this.totalContracts = respuesta.meta?.total ?? respuesta.data.length;
        this.respuesta = respuesta.data;
        this.dataSource.data = respuesta.data;
      },
      error: () => {
        this.isLoadingResults = false;
      },
    });
  }

  // Reinicia a la primera página y vuelve a consultar con los filtros actuales
  searchContracts() {
    // Si el usuario busca por otro campo sin haber tocado la fecha, quitamos
    // el rango "hoy" que viene por defecto para no combinarlo silenciosamente.
    if (!this.dateRangeTouched) {
      this.rangoFechas.setValue({ start: null, end: null }, { emitEvent: false });
    }

    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.getContracts();
  }

  onFilterFieldChange() {
    this.filterChange$.next();
  }

  toggleFilters() {
    this.isFilterVisible = !this.isFilterVisible;
  }

  clearFilters() {
    this.code = '';
    this.customerName = '';
    this.planId = null;
    this.cityId = null;
    this.promotionId = null;
    this.rangoFechas.setValue({ start: null, end: null }, { emitEvent: false });
    this.searchContracts();
  }

  getPlans() {
    this.planService.getPlans().subscribe((respuesta) => {
      this.plans = respuesta.data ?? [];
    });
  }

  getCities() {
    this.cityService.getCities().subscribe((respuesta) => {
      this.cities = respuesta.data ?? [];
    });
  }

  getPromotions() {
    this.promotionService.getPromotions().subscribe((respuesta) => {
      this.promotions = respuesta.data ?? [];
    });
  }

  actualizarColumnasVisibles(columnasSeleccionadas: any[]) {
    this.displayedColumns = columnasSeleccionadas.map((opcion) => opcion.value);
  }

  goToLinkMap(latitude: string, longitude: string) {
    //'https://www.google.com/maps?q=-4.907545,-81.057223&hl=es-Pe&gl=pe&shorturl=1;'
    window.open(
      `https://www.google.com/maps?q=${latitude},${longitude}&hl=es-Pe&gl=pe&shorturl=1;`,
      '_blank',
    );
  }

  changePlan(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.width = '40%';
    dialogConfig.data = row;
    this.dialog.open(ContractEditPlanComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => {});
  }

  changeVLAN(id: number) {
    //filtrar la caja del contrato
    this.contrato = this.respuesta.filter((contrato) => contrato.id === id);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    //dialogConfig.width = '40%';
    dialogConfig.data = this.contrato;
    this.dialog.open(ChangeVlanComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => {});
  }

  changeUser(id: number) {
    //filtrar la caja del contrato
    this.contrato = this.respuesta.filter((contrato) => contrato.id === id);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    //dialogConfig.width = '40%';
    dialogConfig.data = this.contrato;
    this.dialog.open(ChangeUserComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => {});
  }

  changeIptv(id: number) {
    //filtrar la caja del contrato
    this.contrato = this.respuesta.filter((contrato) => contrato.id === id);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    //dialogConfig.width = '40%';
    dialogConfig.data = this.contrato;
    this.dialog.open(ChangeIptvComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => {});
  }

  addPromo(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.width = '40%';
    dialogConfig.data = row;
    this.dialog.open(AddPromoComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => {});
  }

  changeBilling(_t114: any) {
    throw new Error('Method not implemented.');
  }

  inactiveService(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '600px';
    dialogConfig.data = row;
    this.dialog.open(ContractSuspendComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => {
      this.getContracts();
    });
  }

  deleteService(id: number) {
    Swal.fire({
      title: 'Esta seguro?',
      text: 'No podrá recuperar el contrato después de eliminar!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#43a047',
      cancelButtonColor: '#e91e63',
      confirmButtonText: 'Si, eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.contractService.deleteContract(id).subscribe(
          (respuesta) => {
            if (respuesta.status == true) {
              this.snackbarService.showSuccess(`✅${respuesta.message}`);
            } else {
              this.snackbarService.showError(
                `☹️ Ocurrio un error: ${respuesta.message}`,
              );
            }
          },
          (error) => {
            this.snackbarService.showError(
              `☹️ Ocurrio un error al eliminar el contrato`,
            );
            console.log('Error al eliminar el cliente', error.message);
          },
        );
      }
    });
  }

  finishService(row: any) {
    this.routerService.getTestConnection(row.routerId).subscribe({
      next: (respuesta) => {
        console.log(respuesta);
        this.testMK = respuesta;
        if (respuesta.conectado === true) {
          this.statusMK = '🟢 En línea';
        } else {
          this.statusMK = '🔴 Desconectado';
        }
        Swal.fire({
          title: 'Terminar Contrato',
          text: `Se va a liberar la caja, puerto y equipo del Contrato ${row.serviceCode}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#43a047',
          cancelButtonColor: '#e91e63',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Si, terminar',
          input: 'checkbox',
          // Arranca siempre marcado (igual que Suspender), sin depender del
          // test de conectividad en vivo -- si el test justo sale
          // "Desconectado" por un timeout puntual, no debe dejar sin borrar
          // el usuario del Mikrotik en silencio.
          inputValue: 1,
          inputLabel: 'Borrar en Mikrotik - ' + this.statusMK,
        }).then((result) => {
          if (result.isConfirmed) {
            this.suspensionService
              .finishService(row.id, result.value)
              .subscribe({
                next: (respuesta) => {
                  this.snackbarService.showInfo(`${respuesta.message}`);
                  this.getContracts();
                },
                error: (err) => {
                  this.snackbarService.showError(err);
                },
              });
          }
        });
      },
      error: (error) => {
        // this.formContrato.get('mikrotik')?.setValue(false);
        this.statusMK = '🔴Desconectado';
      },
    });
  }

  viewMap(latitude: string, longitude: string) {
    window.open(
      `https://www.google.com/maps?q=${latitude},${longitude}&hl=es-Pe&gl=pe&shorturl=1;`,
      '_blank',
    );
  }

  changePort(id: number) {
    //filtrar la caja del contrato
    this.contrato = this.respuesta.filter((contrato) => contrato.id === id);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    //dialogConfig.width = '40%';
    dialogConfig.data = this.contrato;
    this.dialog.open(ChangePortComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => {});
  }

  changeEquipment(id: number) {
    //filtrar la caja del contrato
    this.contrato = this.respuesta.filter((contrato) => contrato.id === id);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.contrato;
    this.dialog.open(ChangeEquipmentComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => {});
  }

  viewDetail(id: number) {
    this.router.navigate(['/dashboard/contract/contract-detail/' + id]); // Navega al detalle del contrato
  }

  showError() {
    this.snackbarService.showError('☹️ Cliente ya se encuentra registrado');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Cliente agregado correctamente');
  }

  editDataBasic(id: number) {
    this.router.navigate([
      '/dashboard/contract/contract-edit-data-basic/' + id,
    ]); // Navega al componente "editar datos basicos"
  }

  //Reactivar contrato
  reactiveService(id: number) {
    Swal.fire({
      title: 'Esta seguro?',
      text: 'Se va a reactivar el Servicio!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#43a047',
      cancelButtonColor: '#e91e63',
      confirmButtonText: 'Si, reactivar',
      input: 'checkbox',
      inputValue: 1,
      inputLabel: 'Reactivar en Mikrotik',
    }).then((result) => {
      if (result.isConfirmed) {
        this.suspensionService.reactiveService(id, result.value).subscribe({
          next: (respuesta) => {
            this.snackbarService.showInfo(`${respuesta.message}`);
            this.getContracts();
          },
          error: (err) => {
            this.snackbarService.showError(err);
          },
        });
      }
    });
  }

  generateInvoices(row: any) {
    Swal.fire({
      title: 'Generar Facturas',
      text: `Se van a generar las facturas para el contrato! ${row.serviceCode}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#43a047',
      cancelButtonColor: '#e91e63',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, generar',
      input: 'number',
      inputValue: 0,
      inputLabel: 'Número de meses a generar {0 = Mes actual}',
    }).then((result) => {
      if (result.isConfirmed) {
        this.contractService.generateInvoices(row.id, result.value).subscribe({
          next: (respuesta) => {
            if (respuesta.totalInvoices == 0) {
              this.snackbarService.showInfo(`${respuesta.message}`);
            } else {
              this.snackbarService.showSuccess(`✅${respuesta.message}`);
            }
          },
          error: (err) => {
            this.snackbarService.showError(err);
          },
        });
      }
    });
  }

  checkMK(idR: number) {
    this.routerService.getTestConnection(idR).subscribe({
      next: (respuesta) => {
        //console.log(respuesta);
        this.testMK = respuesta;
        if (respuesta.conectado === true) {
          this.statusMK = '🟢En línea';
        } else {
          this.statusMK = '🔴Desconectado';
        }
      },

      error: (error) => {
        // this.formContrato.get('mikrotik')?.setValue(false);
        this.statusMK = '🔴Desconectado';
      },
    });
  }

  testMK: TestResponse = {
    ip: '',
    usuario: '',
    conectado: false,
    mensaje: '',
    system_info: {
      headers: {},
      original: [],
      exception: null,
    },
  };
}
