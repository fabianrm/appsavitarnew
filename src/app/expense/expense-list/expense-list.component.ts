import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Expense } from '../Models/ExpenseResponse';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { ExpenseService } from '../expense.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ExpenseCreateComponent } from '../expense-create/expense-create.component';
import { ExpenseEditComponent } from '../expense-edit/expense-edit.component';

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

  displayedColumns: string[] = ['id', 'description', 'date', 'reason', 'voutcher', 'note', 'amount', 'acciones'];
  public dataSource!: MatTableDataSource<Expense>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription
  public respuesta?: Expense[];

  constructor(private expenseService: ExpenseService, public dialog: MatDialog) { }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  ngOnInit() {
    this.getExpenses();
    this.subscription = this.expenseService.refresh$.subscribe(() => {
      this.getExpenses()
    });
  }


  getExpenses() {
    this.expenseService.getExpenses().subscribe((respuesta) => {

      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
      //  console.log(respuesta)
    });
  }


  //Nuevo
  openDialog(arg0: string) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
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


}
