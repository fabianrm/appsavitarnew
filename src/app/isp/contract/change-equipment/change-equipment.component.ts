import { Component, Inject } from '@angular/core';
import { EquipmentService } from '../../equipment/equipment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { Service } from '../Models/ServiceResponse';
import { ContractService } from '../contract.service';
import { Observable, map, startWith } from 'rxjs';
import { Equipment } from '../../equipment/Models/EquipmentResponse';

@Component({
    selector: 'app-change-equipment',
    templateUrl: './change-equipment.component.html',
    styleUrl: './change-equipment.component.scss',
    standalone: false
})
export class ChangeEquipmentComponent {

  constructor(
    public formulario: FormBuilder,
    private equipmentService: EquipmentService,
    private contractService: ContractService,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public getData: Service[],
    private dialogRef: MatDialogRef<ChangeEquipmentComponent>) { }


  formContrato!: FormGroup;

  // equipment: Equipment[] = [];

  equipments: Equipment[] = [];
  filteredEquipos!: Observable<Equipment[]>;
  selectedEquipment!: Equipment | null;

  ngOnInit() {

    this.initForm();
    this.getEquipments();
  }



  initForm() {
    const formControlsConfig = {
      equipmentId: [this.getData[0].equipmentId, Validators.required],
      userPppoe: [this.getData[0].userPppoe, Validators.required],
      passPppoe: [this.getData[0].passPppoe, Validators.required],
    }
    this.formContrato = this.formulario.group(formControlsConfig);
    //this.formContrato.setValue({ 'equipmentId': this.getData[0].equipmentSerie });


    //Subscribirse a los cambios del combo equipo
    this.formContrato.get('equipmentId')!.valueChanges.subscribe(value => {
      this.selectedEquipment = typeof value === 'object' ? value : null;
    });

    //Filtrar combo equipos por serie 
    this.filteredEquipos = this.formContrato.get('equipmentId')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.serie)),
      map(serie => (serie ? this._filter(serie) : this.equipments.slice()))
    );


  }


  //Busqueda incremental de equipos
  getEquipments() {
    this.equipmentService.getEquipmentsAvailable().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.equipments = respuesta.data
      }
    });
  }

  // displayFn(equipment: Equipment): string {
  //   return equipment && equipment.serie ? equipment.serie : '';
  // }

  displayFn(equipment: Equipment): string {
    if (equipment) {
      if (equipment.serie) {
        return equipment.serie;
      } else if (equipment.mac) {
        return equipment.mac;
      }
    }
    return '';
  }

  // private _filter(name: string): Equipment[] {
  //   const filterValue = name.toLowerCase();
  //   return this.equipments.filter(option => option.serie.toLowerCase().includes(filterValue));
  // }

  private _filter(name: string): Equipment[] {
    const filterValue = name.toLowerCase();

    // Filtrar por serie
    let filteredEquipments = this.equipments.filter(option =>
      option.serie.toLowerCase().includes(filterValue)
    );

    // Si no encuentra resultados, filtrar por mac
    if (filteredEquipments.length === 0) {
      filteredEquipments = this.equipments.filter(option =>
        option.mac.toLowerCase().includes(filterValue)
      );
    }

    return filteredEquipments;
  }

  // Para obtener solo el id cuando se guarda el formulario
  get equipmentIdValue(): number | null {
    const equipment = this.formContrato.get('equipmentId')!.value;
    return equipment ? equipment.id : null;
  }


  enviarDatos(): any {

    const formData = this.formContrato.value;
    const equipmentId = this.equipmentIdValue;

    const dataToSend = {
      ...formData,
      equipmentId: equipmentId,
    };

    if (this.formContrato.valid) {
      this.contractService.updateEquipment(this.getData[0].id, dataToSend).subscribe(respuesta => {
        // console.log(respuesta);
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
