import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ContractService } from '../contract.service';
import { ReqPlan, ResponsePlan } from '../../plan/Models/ResponsePlan';
import { PlanService } from '../../plan/plan.service';
import { ReqRouter, ResponseRouter } from '../../router/Models/ResponseRouter';
import { RouterService } from './../../router/router.service';
import { Box } from '../../box/Models/ResponseBox';
import { BoxService } from '../../box/box.service';
import { City } from '../../city/Models/CityResponse';
import { CityService } from '../../city/city.service';
import { EquipmentService } from '../../equipment/equipment.service';
import { Equipment } from '../../equipment/Models/Equipment';
import { DatePipe } from '@angular/common';
import { Observable, map, startWith } from 'rxjs';
import { Customer } from '../../customer/Models/CustomerResponse';

//TODO: QUITAR LOS CAMPOS DIA DE FACTURACION Y CORTE Y AGREGARLOS EN EL INVOICE

interface Dias {
  value: string;
  viewValue: string;
}

interface Ports {
  id: string;
  port_number: string;
}

@Component({
  selector: 'app-contract-create',
  templateUrl: './contract-create.component.html',
  styleUrl: './contract-create.component.css',
})
export class ContractCreateComponent implements OnInit {

  formContrato!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;
  planInicial = 1;
  planSelected: any;
  boxSelected = 1;
  equipmentSelected = 1;
  citySelected = 1;
  recurrent = true

  routers: ReqRouter[] = [];
  boxs: Box[] = [];
  ports: Ports[] = [];
  cities: City[] = [];
  planes: ReqPlan[] = [];
  plan: ReqPlan[] = [];
  equipment: Equipment[] = [];

  equipments: Equipment[] = [];
  filteredEquipos!: Observable<Equipment[]>;
  selectedEquipment!: Equipment | null;

  ciclos: Dias[] = [
    { value: '1', viewValue: '01' },
    { value: '15', viewValue: '15' },
  ]

  vencimientos: Dias[] = [
    { value: '5', viewValue: '05' },
    { value: '20', viewValue: '20' },
  ]

  date = new Date();

  constructor(public formulario: FormBuilder,
    private contractService: ContractService,
    private planService: PlanService,
    private routerService: RouterService,
    private boxService: BoxService,
    private cityService: CityService,
    private equipmentService: EquipmentService,
    @Inject(MAT_DIALOG_DATA) public getData: Customer,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<ContractCreateComponent>) { }


  ngOnInit(): void {
    this.getPlans()
    this.getCities()
    this.getRouters()
    this.getBoxs()
    this.getEquipments()
    this.initForm()
  }


  initForm() {

    this.formContrato = this.formulario.group({
      customerId: [this.getData.id],
      planId: [this.planInicial, Validators.required],
      routerId: ['', Validators.required],
      boxId: ['', Validators.required],
      portNumber: ['', Validators.required],
      equipmentId: ['', Validators.required],
      cityId: [this.citySelected, Validators.required],
      addressInstallation: ['', Validators.required],
      reference: ['', Validators.required],
      registrationDate: [this.datePipe.transform(this.date, "yyyy-MM-dd")],
      installationDate: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      billingDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      status: ['activo'],
      endDate: [''],
    });

    this.filteredEquipos = this.formContrato.get('equipmentId')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.serie)),
      map(serie => (serie ? this._filter(serie) : this.equipments.slice()))
    );
    
    this.formContrato.get('equipmentId')!.valueChanges.subscribe(value => {
      this.selectedEquipment = typeof value === 'object' ? value : null;
    });

  }

  displayFn(equipment: Equipment): string {
    return equipment && equipment.serie ? equipment.serie : '';
  }

  private _filter(name: string): Equipment[] {
    const filterValue = name.toLowerCase();
    return this.equipments.filter(option => option.serie.toLowerCase().includes(filterValue));
  }


  // Para obtener solo el id cuando se guarda el formulario
  get equipmentIdValue(): number | null {
    const equipment = this.formContrato.get('equipmentId')!.value;
    return equipment ? equipment.id : null;
  }


  getPlans() {
    this.planService.getPlans().subscribe((respuesta: ResponsePlan) => {
      // console.log(respuesta.data.length);
      if (respuesta.data.length > 0) {
        this.planes = respuesta.data;
        //const defaultPlanId = this.planes[0]?.id; // Asegúrate de que hay planes y selecciona el primero
        // this.formContrato.patchValue({ plan_id: this.planInicial });
        //Después de cargar los planes llamamos al seleccionado
        this.getPlanbyID(this.planInicial);
      }
    });
  }


  getPlanbyID(id: number) {
    if (this.planes.length > 0) {
      this.planSelected = this.planes.filter(plan => plan.id == id);
    }
  }


  getRouters() {
    this.routerService.getRouters().subscribe((respuesta: ResponseRouter) => {
      if (respuesta.data.length > 0) {
        this.routers = respuesta.data;
      }
    });
  }

  getBoxs() {
    this.boxService.getBoxes().subscribe((respuesta) => {
      if (respuesta.data.boxs.length > 0) {
        this.boxs = respuesta.data.boxs;
      }
    });
  }

  getPorts(id: number) {
    this.boxService.getPortsAvailables(id).subscribe((respuesta: Ports[]) => {
      if (respuesta.length > 0) {
        this.ports = respuesta
      }
    });
  }


  getCities() {
    this.cityService.getCities().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.cities = respuesta.data
      }
    });
  }


  getEquipments() {
    this.equipmentService.getEquipments().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.equipments = respuesta.data
      }
    });
  }


  enviarDatos(): any {

    const formData = this.formContrato.value;
    const installDate = new Date(formData.installationDate).toISOString().split('T')[0];

    const equipmentId = this.equipmentIdValue;

    const dataToSend = {
      ...formData,
      installationDate: installDate,
      equipmentId: equipmentId
    };


    if (this.formContrato.valid) {
      //console.log('agregar....')
      this.contractService.addService(dataToSend).subscribe(respuesta => {

        this.msgSusscess('Contrato agregado correctamente');
        this.dialogRef.close();
      });
    }
  }

  msgSusscess(mensaje: string) {
    this._snackBar.open(mensaje, 'APPSAVITAR', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }



}
