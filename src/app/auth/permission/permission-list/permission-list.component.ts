import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { PermissionService } from '../permission.service';
import { buildPermissionTree, Permission } from '../Models/PermissionResponse';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PermissionRole } from '../Models/PermissionRoleResponse';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrl: './permission-list.component.scss'
})
export class PermissionListComponent implements OnInit {

  formPermissions!: FormGroup;
  permissions: Permission[] = [];
  permissionsRole: PermissionRole[] = [];

  // Permisos estructurados en jerarquía
  permissionTree: Permission[] = [];
  selectedPermissions: number[] = [];
  permissions_send: number[] = [];


  constructor
    (public formulario: FormBuilder,
      @Inject(MAT_DIALOG_DATA) public getData: number,
      private permissionService: PermissionService,
      private snackbarService: SnackbarService,
      private dialogRef: MatDialogRef<PermissionListComponent>) {
    this.getPermissions();
  }

  ngOnInit(): void {
    this.initForm();
    this.getPermissionsByID();
  }


  initForm() {
    const formControlsConfig = {
      permissions: ['', Validators.required],
    }
    this.formPermissions = this.formulario.group(formControlsConfig);
  }


  getPermissions() {
    this.permissionService.getPermissions().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.permissions = respuesta.data;
        //  console.log('Obteniendo permisos', this.permissions);
        this.permissionTree = buildPermissionTree(this.permissions);
      }
    });
  }


  getPermissionsByID() {
    this.permissionService.getPermissionsByID(this.getData).subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.permissionsRole = respuesta.data;
        // Filtrar los permisos con parent_id !== null y mapear solo los IDs
        const permissionIds = this.permissionsRole
          .filter((permission: any) => permission.parent_id !== null)
          .map((permission: any) => permission.id);
        // Construir el árbol de permisos y luego seleccionar los permisos
        this.permissionTree = buildPermissionTree(this.permissions);
        this.selectPermissions(permissionIds);
      }
    });
  }


  selectPermissions(permissionIds: number[]) {
    this.selectPermissionsRecursive(this.permissionTree, permissionIds);
    this.updateSelectedPermissions();
  }

  selectPermissionsRecursive(nodes: Permission[], permissionIds: number[]) {
    for (const node of nodes) {
      if (permissionIds.includes(node.id)) {
        this.onCheckboxChange(node, true);
      }
      if (node.children!.length > 0) {
        this.selectPermissionsRecursive(node.children!, permissionIds);
      }
    }
  }


  onCheckboxChange(node: Permission, checked: boolean) {
    node.checked = checked;
    this.updateChildrenRecursive(node, checked);
    this.updateParentRecursive(node);
    this.updateSelectedPermissions();
  }

  updateChildrenRecursive(node: Permission, checked: boolean) {
    node.children?.forEach(child => {
      child.checked = checked;
      this.updateChildrenRecursive(child, checked);
    });
  }

  updateParentRecursive(node: Permission) {
    const parent = this.findParentNode(node);
    if (parent) {
      const allChildrenChecked = parent.children?.every(child => child.checked);
      //const someChildrenChecked = parent.children?.some(child => child.checked);

      parent.checked = allChildrenChecked;

      // Actualizar el padre del padre
      this.updateParentRecursive(parent);
    }
  }

  findParentNode(node: Permission): Permission | null {
    for (const potentialParent of this.permissionTree) {
      const found = this.findNodeById(potentialParent, node.parent_id);
      if (found) return found;
    }
    return null;
  }

  findNodeById(node: Permission, id: number | null): Permission | null {
    if (node.id === id) return node;
    for (const child of node.children!) {
      const found = this.findNodeById(child, id);
      if (found) return found;
    }
    return null;
  }

  someChildrenChecked(node: Permission): boolean {
    return node.children!.some(child => child.checked || this.someChildrenChecked(child));
  }

  allChildrenChecked(node: Permission): boolean {
    return node.children!.every(child => child.checked && this.allChildrenChecked(child));
  }

  updateSelectedPermissions() {
    this.selectedPermissions = this.getSelectedPermissionsRecursive(this.permissionTree);
  }

  getSelectedPermissionsRecursive(nodes: Permission[]): number[] {
    let selected: number[] = [];
    for (const node of nodes) {
      if (node.checked || this.someChildrenChecked(node)) {
        selected.push(node.id);
      }
      if (node.children!.length > 0) {
        selected = selected.concat(this.getSelectedPermissionsRecursive(node.children!));
      }
    }
    this.permissions_send = selected;

    return selected;
  }

  close() {
    this.dialogRef.close();

  }

  enviarDatos() {
    const formData = this.formPermissions.value;
    const dataToSend = {
      ...formData,
      permissions: this.permissions_send,
    };
    this.permissionService.addPermissions(this.getData, dataToSend).subscribe(respuesta => {
      if (respuesta.status === 'ok') {
        this.showSuccess();
        this.dialogRef.close();

      } else {
        this.showError();
      }
    });

  }

  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro agregado correctamente');
  }


}

