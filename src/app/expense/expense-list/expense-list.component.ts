import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Expense } from '../Models/ExpenseResponse';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription, isEmpty } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { ExpenseService } from '../expense.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ExpenseCreateComponent } from '../expense-create/expense-create.component';
import { ExpenseEditComponent } from '../expense-edit/expense-edit.component';
import { ActivatedRoute} from '@angular/router';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExpensePaidComponent } from '../expense-paid/expense-paid.component';


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


  displayedColumns: string[] = ['id', 'description', 'date', 'reason', 'voutcher', 'note', 'amount', 'status', 'acciones'];


  public dataSource!: MatTableDataSource<Expense>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription
  public respuesta?: Expense[];
  tipo: string = '';


  constructor(
    private expenseService: ExpenseService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,) { }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  ngOnInit() {
    this.route.data.subscribe(data => {
      this.tipo = data['tipo'];
    });

    if (this.tipo === 'fijo') {
      this.displayedColumns.splice(7,0,'datePaid')
    } 

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

  //Paid Dialog

  openPaidDialog(row: Expense) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data =row;
    this.dialog.open(ExpensePaidComponent, dialogConfig);
    this.dialog.afterAllClosed.subscribe(() => { })
  }



  generatePaids() {
    this.expenseService.generatePaids().subscribe(respuesta => {

      if (respuesta.data.total > 0) {
        this.msgSusscess(`Se han generado ${respuesta.data.total}  facturas correctamente`);
      } else {
        this.msgSusscess(`No se encontraron facturas que generar`);
      }
      
    });
  }



  deleteExpense(id: number) {
    Swal.fire({
      title: "Está seguro?",
      text: "Se suspenderá la generación de próximas facturas!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, suspender!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {

        const dataToSend = {
          status: false,
        };

        this.expenseService.suspendPaid(id, dataToSend).subscribe(respuesta => {
          if (!respuesta.data.isEmpty) {
            
            Swal.fire({
              title: "Suspender!",
              text: "Se ha suspendido la generación de facturas.",
              icon: "success"
            });
          }
        }); 
      }
    });
  }



  msgSusscess(mensaje: string) {
    this._snackBar.open(mensaje, 'SAVITAR', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }




}
