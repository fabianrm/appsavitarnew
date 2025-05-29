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
import { PermissionListComponent } from '../../permission/permission-list/permission-list.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss',
  standalone: false
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

  get roleUser() {
    return localStorage.getItem('role');
  }

  getRoles() {
    this.roleService.getRoles().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        if (Number(this.roleUser) !== 1) {
          this.dataSource = new MatTableDataSource(respuesta.data.filter((x: any) => x.id !== 1));
        } else {
          this.dataSource = new MatTableDataSource(respuesta.data);
        }
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

    this.roleService.deleteRole(id).subscribe({
      next: (respuesta) => {
        this.snackbarService.showSuccess(respuesta.message);

      },
      error: (err) => {
        this.snackbarService.showError(err);
      }

    });

  }


  addPermisions(id: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    //dialogConfig.width = '40%';
    dialogConfig.height = '600px';
    dialogConfig.data = id;
    this.dialog.open(PermissionListComponent, dialogConfig);

    this.dialog.afterAllClosed.subscribe(() => {
    })
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
