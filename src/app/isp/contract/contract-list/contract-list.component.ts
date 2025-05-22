import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, startWith } from 'rxjs';
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


@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrl: './contract-list.component.scss',
  standalone: false
})
export class ContractListComponent implements OnInit {

  availableColumns: string[] = ['id', 'serviceCode', 'customerName', 'planName', 'installationDate', 'city', 'addressInstallation', 'latitude', 'longitude', 'promotion', 'status', 'acciones'];

  displayedColumns: string[] = ['serviceCode', 'customerName', 'planName', 'installationDate', 'city', 'addressInstallation', 'promotion', 'status', 'acciones'];


  public dataSource!: MatTableDataSource<Service>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta!: Service[];
  public contrato!: Service[];

  constructor(
    private contractService: ContractService,
    private suspensionService: SuspensionService,
    public dialog: MatDialog, private router: Router,
    private snackbarService: SnackbarService) { }

  ngOnInit() {
    this.getContracts();
    this.subscription = this.contractService.refresh$.subscribe(() => {
      this.getContracts()
    });

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getContracts() {
    this.contractService.getservices().subscribe((respuesta) => {
      // console.log(respuesta.data.services)
      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.respuesta = respuesta.data;
      }
      //  console.log(respuesta)
    });
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goToLinkMap(latitude: string, longitude: string) {
    //'https://www.google.com/maps?q=-4.907545,-81.057223&hl=es-Pe&gl=pe&shorturl=1;'
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}&hl=es-Pe&gl=pe&shorturl=1;`, "_blank");
  }


  changePlan(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.width = '40%';
    dialogConfig.data = row;
    this.dialog.open(ContractEditPlanComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { });
  }


  changeVLAN(id: number) {

    //filtrar la caja del contrato
    this.contrato = this.respuesta.filter(contrato => contrato.id === id)

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    //dialogConfig.width = '40%';
    dialogConfig.data = this.contrato;
    this.dialog.open(ChangeVlanComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { });

  }


  changeUser(id: number) {
    //filtrar la caja del contrato
    this.contrato = this.respuesta.filter(contrato => contrato.id === id)

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    //dialogConfig.width = '40%';
    dialogConfig.data = this.contrato;
    this.dialog.open(ChangeUserComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { });
  }


  addPromo(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.width = '40%';
    dialogConfig.data = row;
    this.dialog.open(AddPromoComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { });
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
      title: "Esta seguro?",
      text: "No podrá recuperar el contrato después de eliminar!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#43a047",
      cancelButtonColor: "#e91e63",
      confirmButtonText: "Si, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.contractService.deleteContract(id).subscribe((respuesta) => {

          if (respuesta.status == true) {
            this.snackbarService.showSuccess(`✅${respuesta.message}`);
          } else {
            this.snackbarService.showError(`☹️ Ocurrio un error: ${respuesta.message}`);
          }
        }, error => {
          this.snackbarService.showError(`☹️ Ocurrio un error al eliminar el contrato`);
          console.log('Error al eliminar el cliente', error.message);
        });
      }
    });
  }

  finishService(row: any) {
    Swal.fire({
      title: "Terminar Contrato",
      text: `Se va a liberar la caja, puerto y equipo del Contrato ${row.serviceCode}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#43a047",
      cancelButtonColor: "#e91e63",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, terminar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.suspensionService.finishService(row.id).
          subscribe({
            next: (respuesta) => {
              this.snackbarService.showInfo(`${respuesta.message}`);
              this.getContracts();
            },
            error: (err) => {
              this.snackbarService.showError(err);
            }
          })
      }
    });
  }


  viewMap(latitude: string, longitude: string) {
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}&hl=es-Pe&gl=pe&shorturl=1;`, "_blank");
  }


  changePort(id: number) {

    //filtrar la caja del contrato
    this.contrato = this.respuesta.filter(contrato => contrato.id === id)

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    //dialogConfig.width = '40%';
    dialogConfig.data = this.contrato;
    this.dialog.open(ChangePortComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { });
  }

  changeEquipment(id: number) {
    //filtrar la caja del contrato
    this.contrato = this.respuesta.filter(contrato => contrato.id === id)
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = this.contrato;
    this.dialog.open(ChangeEquipmentComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { });
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
    this.router.navigate(['/dashboard/contract/contract-edit-data-basic/' + id]); // Navega al componente "editar datos basicos"
  }

  //Reactivar contrato
  reactiveService(id: number) {

    Swal.fire({
      title: "Esta seguro?",
      text: "Se va a reactivar el Servicio!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#43a047",
      cancelButtonColor: "#e91e63",
      confirmButtonText: "Si, reactivar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.suspensionService.reactiveService(id).
          subscribe({
            next: (respuesta) => {
              this.snackbarService.showInfo(`${respuesta.message}`);
              this.getContracts();
            },
            error: (err) => {
              this.snackbarService.showError(err);
            }
          })
      }
    });
  }

  generateInvoices(row: any) {
    Swal.fire({
      title: "Generar Facturas",
      text: `Se van a generar las facturas para el contrato! ${row.serviceCode}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#43a047",
      cancelButtonColor: "#e91e63",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Si, generar"
    }).then((result) => {
      if (result.isConfirmed) {

        this.contractService.generateInvoices(row.id).
          subscribe({
            next: (respuesta) => {
              if (respuesta.totalInvoices == 0) {
                this.snackbarService.showInfo(`${respuesta.message}`);
              } else {
                this.snackbarService.showSuccess(`✅${respuesta.message}`);
              }
            },
            error: (err) => {
              this.snackbarService.showError(err);
            }
          })
      }

    });
  }


}
