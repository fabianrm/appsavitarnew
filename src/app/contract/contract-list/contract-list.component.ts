import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ContractService } from '../contract.service';
import { ContractEditPlanComponent } from '../contract-edit-plan/contract-edit-plan.component';
import { Service } from '../Models/ServiceResponse';
import { ChangePortComponent } from '../change-port/change-port.component';



@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrl: './contract-list.component.css'
})
export class ContractListComponent implements OnInit {


  displayedColumns: string[] = ['id', 'serviceCode', 'customerName', 'planName', 'installationDate', 'addressInstallation', 'latitude', 'longitude', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<Service>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta!: Service[];
  public contrato!: Service[];

  constructor(private contractService: ContractService, public dialog: MatDialog) { }

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
    dialogConfig.width = '40%';
    dialogConfig.data = row;
    this.dialog.open(ContractEditPlanComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { });
  }


  changeBilling(_t114: any) {
    throw new Error('Method not implemented.');
  }

  inactiveService(_t114: any) {
    throw new Error('Method not implemented.');
  }

  viewMap(latitude: string, longitude: string) {
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}&hl=es-Pe&gl=pe&shorturl=1;`, "_blank");
  }

  viewDetail(_t114: any) {
    throw new Error('Method not implemented.');
  }


  changePort(id: number) {

    //filtrar la caja del contrato
    this.contrato = this.respuesta.filter(contrato => contrato.id === id)

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = this.contrato;
    this.dialog.open(ChangePortComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { });
  }



}
