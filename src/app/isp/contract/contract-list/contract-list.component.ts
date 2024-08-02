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


@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrl: './contract-list.component.scss'
})
export class ContractListComponent implements OnInit {


  displayedColumns: string[] = ['id', 'serviceCode', 'customerName', 'planName', 'installationDate', 'addressInstallation', 'latitude', 'longitude', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<Service>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta!: Service[];
  public contrato!: Service[];

  constructor(
    private contractService: ContractService,
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


  changeBilling(_t114: any) {
    throw new Error('Method not implemented.');
  }

  inactiveService(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    //dialogConfig.width = '40%';
    dialogConfig.data = row;
    this.dialog.open(ContractSuspendComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { });
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
    //dialogConfig.width = '40%';
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


}
