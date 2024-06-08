import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Expense } from '../Models/ExpenseResponse';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription, filter } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { ExpenseService } from '../expense.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ExpenseCreateComponent } from '../expense-create/expense-create.component';
import { ExpenseEditComponent } from '../expense-edit/expense-edit.component';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.scss'
})
export class ExpenseListComponent implements OnInit, OnDestroy {


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  displayedColumns: string[] = ['id', 'type', 'description', 'date', 'reason', 'voutcher', 'note', 'amount', 'acciones'];
  public dataSource!: MatTableDataSource<Expense>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription
  public respuesta?: Expense[];
  tipo: string = '';


  constructor(private expenseService: ExpenseService, public dialog: MatDialog, private route: ActivatedRoute,) { }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  ngOnInit() {
    this.route.data.subscribe(data => {
      this.tipo = data['tipo'];
      console.log('Variable:', this.tipo);
    });


    this.getExpenses();
    this.subscription = this.expenseService.refresh$.subscribe(() => {
      this.getExpenses()
    });
  }


  getExpenses() {
    this.expenseService.getExpenses().subscribe((respuesta) => {

      if (respuesta.data.length > 0) {

        this.respuesta = respuesta.data.filter(item => item.type === this.tipo);

        this.dataSource = new MatTableDataSource(this.respuesta);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      //  console.log(respuesta)
    });
  }


  //Nuevo
  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = this.tipo;

    this.dialog.open(ExpenseCreateComponent, dialogConfig);

    this.dialog.afterAllClosed.subscribe(() => {
    })
  }

  //Editar
  openEditDialog(id: number) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = id;

    this.dialog.open(ExpenseEditComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { })
  }


  exportToExcel() {
    throw new Error('Method not implemented.');
  }

  deleteExpense(arg0: any) {
    throw new Error('Method not implemented.');
  }



}
