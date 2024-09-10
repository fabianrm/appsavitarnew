import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Destination } from '../../destination/models/DestinationResponse';
import { Employee } from '../../employee/models/EmployeeResponse';
import { MatTableDataSource } from '@angular/material/table';
import { DestinationService } from '../../destination/destination.service';
import { EmployeeService } from '../../employee/employee.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EntrySelectDialogComponent } from '../entry-select-dialog/entry-select-dialog.component';
import { OutputService } from './../output.service';
import { OutputDetail, OutputRequest } from '../models/OutputRequest';

@Component({
  selector: 'app-output-create',
  templateUrl: './output-create.component.html',
  styleUrl: './output-create.component.scss'
})
export class OutputCreateComponent implements OnInit {

  outputForm!: FormGroup;
  destinations: Destination[] = []
  employees: Employee[] = []

  dataSource!: MatTableDataSource<any>;

  date = new Date();


  constructor(
    public fb: FormBuilder,
    private destinationService: DestinationService,
    private employeeService: EmployeeService,
    private outputService: OutputService,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private router: Router,
    private dialog: MatDialog
  ) { }


  ngOnInit() {

    this.initForm();
    this.getDestinations();
    this.getEmployees();

  }


  //TODO: Cambiar el id de employee

  initForm() {
    this.outputForm = this.fb.group({
      destination_id: ['', Validators.required],
      employee_id: [1, Validators.required],
      date: [this.datePipe.transform(this.date, "yyyy-MM-dd")],
      total: [0.00, { value: 0, readonly: true }],
      comment: [''],
      status: [1],
      output_details: this.fb.array([])
    });
    this.dataSource = new MatTableDataSource((this.outputForm.get('output_details') as FormArray).controls);

  }

  get outputDetails(): FormArray {
    return this.outputForm.get('output_details') as FormArray;
  }

  //Destinations
  getDestinations() {
    this.destinationService.getDestinations().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.destinations = respuesta.data
      }
    });
  }

  getEmployees() {
    this.employeeService.getEmployees().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.employees = respuesta.data
      }
    });
  }

  openMaterialDialog(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef = this.dialog.open(EntrySelectDialogComponent, dialogConfig);

    dialogRef.componentInstance.addMaterial.subscribe((selectedMaterial: any) => {
      this.addMaterialToTable(selectedMaterial);
    });

  }


  removeDetail(index: number): void {
    this.outputDetails.removeAt(index);
    this.dataSource.data = this.outputDetails.controls;
  }


  // addMaterialToTable(ed: any): void {

  //   const existingMaterialIndex = this.dataSource.data.findIndex(
  //     (item: any) => item.value.id === ed.id
  //   );

  //   if (existingMaterialIndex >= 0) {
  // Si el material ya existe, incrementar la cantidad
  //     this.dataSource.data[existingMaterialIndex].quantity += 1;
  //   } else {
  // Si no existe, agregarlo a la tabla
  //     const newDetail = {
  //       value: ed,
  //       quantity: 1,  // Inicia con cantidad 1 o según lo necesites
  //     };
  //     this.dataSource.data.push(newDetail);
  //   }

  // Refrescar la tabla
  //   this.dataSource._updateChangeSubscription();
  // }


  addMaterialToTable(detail: any): void {

    this.outputDetails.push(this.fb.group({
      ...detail,
      material: detail.material,
      presentation: detail.material.presentation.name,
      quantity: 1
    }));

    this.dataSource.data = this.outputDetails.controls;
    // Refrescar la tabla
    this.dataSource._updateChangeSubscription();
  }


  enviarDatos() {
    // Verifica si el formulario es válido
    if (this.outputForm.invalid) {
      this.outputForm.markAllAsTouched();
      return;
    }

    // Prepara los datos del formulario
    const formValue = this.outputForm.value;
    const currentDate = new Date().toISOString().split('T')[0]; // Formato 'year-month-day'
   
    // Transforma el FormArray en el formato esperado para output_details
    const outputDetails: OutputDetail[] = formValue.output_details.map((detail: any) => {
      return {
        entry_detail_id: detail.id,
        quantity: detail.quantity
      };
    });

    // Prepara el objeto final que se enviará
    const dataToSend: OutputRequest = {
      date: formValue.date,
      destination_id: formValue.destination_id,
      employee_id: formValue.employee_id,
      comment: formValue.comment,
      total: formValue.total,
      status: formValue.status,
      output_details: outputDetails
    };

   // console.log(dataToSend);
    
    //Envía los datos mediante el servicio
    this.outputService.addOutput(dataToSend).subscribe(
      (respuesta) => {
        // Manejo de la respuesta exitosa
        this.router.navigate(['/dashboard/output/outputs']);
        this.showSuccess();
      },
      error => {
        // Manejo de errores
        console.error('Error al enviar los datos:', error);
        this.showError();
      }
    );

  }

  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro agregado correctamente');
  }



}
