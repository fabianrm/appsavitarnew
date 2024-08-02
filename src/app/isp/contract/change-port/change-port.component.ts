import { Component, Inject, OnInit } from '@angular/core';
import { BoxService } from '../../box/box.service';
import { RouterService } from '../../router/router.service';
import { Box } from '../../box/Models/BoxResponse';
import { Ports } from '../Models/Ports';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { ReqRouter, ResponseRouter } from '../../router/Models/ResponseRouter';
import { Service } from '../Models/ServiceResponse';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContractService } from '../contract.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-change-port',
  templateUrl: './change-port.component.html',
  styleUrl: './change-port.component.scss'
})
export class ChangePortComponent implements OnInit {

  constructor(
    public formulario: FormBuilder,
    private routerService: RouterService,
    private boxService: BoxService,
    private contractService: ContractService,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public getData: Service[],
    private dialogRef: MatDialogRef<ChangePortComponent>) { }

  formContrato!: FormGroup;
  boxs: Box[] = [];
  ports: Ports[] = [];
  routers: ReqRouter[] = [];

  filteredBox!: Observable<Box[]>;
  selectedBox!: Box | null;

  ngOnInit(): void {
    this.initForm();
    this.getBoxs();
    this.getRouters();
  }


  initForm() {
    const formControlsConfig = {
      routerId: [this.getData[0].routerId, Validators.required],
      boxId: ['', Validators.required],
      portNumber: ['', Validators.required],
    }
    this.formContrato = this.formulario.group(formControlsConfig);

    //Convertir a mayusculas
    Object.keys(formControlsConfig).forEach(key => {
      if (key === 'addressInstallation' || key === 'reference') {
        this.formContrato.get(key)?.valueChanges.subscribe(value => {
          this.formContrato.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        });
      }
    });


    //Subscribirse a los cambios del combo box
    this.formContrato.get('boxId')!.valueChanges.subscribe(value => {
      this.selectedBox = typeof value === 'object' ? value : null;
      if (this.selectedBox !== null) {
        this.getPorts(this.selectedBox.id);
      }
    });

    //Filtrar combo box por name 
    this.filteredBox = this.formContrato.get('boxId')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.name)),
      map(name => (name ? this._filterBox(name) : this.boxs.slice()))
    );
  }

  //Obtener cajas
  getBoxs() {
    this.boxService.getBoxes().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.boxs = respuesta.data;
      }
    });
  }

  displayFnBox(box: Box): string {
    return box && box.name ? box.name : '';
  }

  private _filterBox(name: string): Box[] {
    const filterValue = name.toLowerCase();
    return this.boxs.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  // Para obtener solo el id cuando se guarda el formulario
  get boxIdValue(): number | null {
    const box = this.formContrato.get('boxId')!.value;
    return box ? box.id : null;
  }

  //Obtener puertos
  getPorts(id: number) {
    this.boxService.getPortsAvailables(id).subscribe((respuesta: Ports[]) => {
      if (respuesta.length > 0) {
        this.ports = respuesta
      }
    });
  }

  //Vlan, caja , port
  getRouters() {
    this.routerService.getRouters().subscribe((respuesta: ResponseRouter) => {
      if (respuesta.data.length > 0) {
        this.routers = respuesta.data;
      }
    });
  }

  enviarDatos(): any {

    const formData = this.formContrato.value;
    const boxId = this.boxIdValue;

    const dataToSend = {
      ...formData,
      boxId: boxId,
    };

    if (this.formContrato.valid) {
      this.contractService.updatePortCustomer(this.getData[0].id, dataToSend).subscribe(respuesta => {
        this.showSuccess();
        this.dialogRef.close();
      });
    }
  }

  showError() {
    this.snackbarService.showError('Ocurrio un error al actualizar los datos...');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Los datos se actualizarón correctamente');
  }





}
