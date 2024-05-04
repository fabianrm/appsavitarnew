import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { PlanCreateComponent } from '../../plan/plan-create/plan-create.component';
import { PlanEditComponent } from '../../plan/plan-edit/plan-edit.component';
import { CContract } from '../Models/CContract';
import { ResContract } from '../Models/ContractResponse';
import { ContractService } from '../contract.service';


@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrl: './contract-list.component.css'
})
export class ContractListComponent {
  
   displayedColumns: string[] = ['id',  'customer_name', 'plan_name',  'registration_date',  'address_instalation', 'latitude', 'longitude', 'is_active', 'acciones'];
  public dataSource!: MatTableDataSource<CContract[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta?: ResContract;

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

      console.log(respuesta.data.services)

      if (respuesta.data.services.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data.services);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      //  console.log(respuesta)
    });
  }


  getPlanById(id: number) {
    this.contractService.getServiceByID(id).subscribe(respuesta => {
      this.respuesta = respuesta.data;
      //console.log(respuesta);
    });
  }



  openEditDialog(id: number) {

    this.contractService.getServiceByID(id).subscribe(respuesta => {
      this.respuesta = respuesta.services;
      console.log(respuesta);

      if (respuesta.data) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.width = '40%';
        dialogConfig.data = this.respuesta;

        this.dialog.open(PlanEditComponent, dialogConfig);
        this.dialog.afterAllClosed.subscribe(() => { })
      }


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
}
