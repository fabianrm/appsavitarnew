import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Role } from '../Models/RoleResponse';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { RoleService } from './../role.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RoleCreateComponent } from '../role-create/role-create.component';
import { RoleEditComponent } from '../role-edit/role-edit.component';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss'
})
export class RoleListComponent {

  displayedColumns: string[] = ['id', 'name', 'acciones'];
  public dataSource!: MatTableDataSource<Role>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta: Role[] = [];


  constructor(private roleService: RoleService,
    public dialog: MatDialog,
    private router: Router,
    private snackbarService: SnackbarService,

  ) { }

  ngOnInit() {
    this.getRoles();
    this.subscription = this.roleService.refresh$.subscribe(() => {
      this.getRoles()
    });


  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getRoles() {
    this.roleService.getRoles().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }


  newRole() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    this.dialog.open(RoleCreateComponent, dialogConfig);

    this.dialog.afterAllClosed.subscribe(() => {
    })
  }


  editRole(row: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '40%';
    dialogConfig.data = row;
    this.dialog.open(RoleEditComponent, dialogConfig);

    this.dialog.afterAllClosed.subscribe(() => {
    })
  }

  deleteRole(id: number) {
    this.roleService.deleteRole(id).subscribe(respuesta => {
      if (respuesta.data.status === 'true') {
        this.showSuccess();

      } else {
        // this.showError();
        this.snackbarService.showError(respuesta.data.message);
      }

    });
  }


  addPermisions(id: number) {
    
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro agregado correctamente');
  }

}
