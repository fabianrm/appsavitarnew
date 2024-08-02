import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { CPlan } from '../Models/CPlan';
import { ReqPlan } from '../Models/ResponsePlan';
import { PlanCreateComponent } from '../plan-create/plan-create.component';
import { PlanEditComponent } from '../plan-edit/plan-edit.component';
import { PlanService } from '../plan.service';


@Component({
  selector: 'app-plan-list',
  templateUrl: './plan-list.component.html',
  styleUrl: './plan-list.component.css'
})
export class PlanListComponent {
  displayedColumns: string[] = ['id', 'name', 'download', 'upload', 'price', 'guaranteed_speed', 'priority', 'burst_limit', 'burst_threshold','burst_time', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<CPlan[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta?: ReqPlan;

  constructor(private planService: PlanService, public dialog: MatDialog) { }

  ngOnInit() {
    this.getPlans();
    this.subscription = this.planService.refresh$.subscribe(() => {
      this.getPlans()
    });

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getPlans() {
    this.planService.getPlans().subscribe((respuesta) => {

      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      //  console.log(respuesta)
    });
  }


  getPlanById(id: number) {
    this.planService.getPlanByID(id).subscribe(respuesta => {
      this.respuesta = respuesta;
      //  console.log(respuesta);
    });
  }


  openDialog(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.width = '40%';
    dialogConfig.height = '680px';
    this.dialog.open(PlanCreateComponent, dialogConfig);

    this.dialog.afterAllClosed.subscribe(() => {
    })
  }


  openEditDialog(id: number) {

    this.planService.getPlanByID(id).subscribe(respuesta => {
      this.respuesta = respuesta.data;
      
      if (respuesta.data) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
       // dialogConfig.width = '40%';
        dialogConfig.height = '680px';
        dialogConfig.data = this.respuesta;

        this.dialog.open(PlanEditComponent, dialogConfig);
        this.dialog.afterAllClosed.subscribe(() => { })
      }
    });
  }

  deletePlan(id: number) {
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
