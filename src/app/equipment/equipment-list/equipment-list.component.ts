import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { EquipmentService } from './../equipment.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EquipmentCreateComponent } from '../equipment-create/equipment-create.component';
import { EquipmentEditComponent } from '../equipment-edit/equipment-edit.component';
import { Equipment } from '../Models/EquipmentResponse';

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrl: './equipment-list.component.scss'
})
export class EquipmentListComponent {

  displayedColumns: string[] = ['id', 'type', 'serie', 'model', 'brand', 'purchaseDate', 'contractCode','status', 'acciones'];

  public dataSource!: MatTableDataSource<Equipment>

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta: Equipment[] = [];

  eqSelected: any;

  constructor(private equipmentService: EquipmentService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getEquipments();
    this.subscription = this.equipmentService.refresh$.subscribe(() => {
      this.getEquipments()
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getEquipments() {
    this.equipmentService.getEquipments().subscribe((respuesta => {
      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.respuesta = respuesta.data;
      }
    }));

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  openDialog(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
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
    dialogConfig.width = '40%';
    dialogConfig.data = this.eqSelected;
    this.dialog.open(EquipmentEditComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { })
  }



}
