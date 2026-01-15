import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Destination } from '../../destination/models/DestinationResponse';
import { Employee } from '../../employee/models/EmployeeResponse';
import { MatTableDataSource } from '@angular/material/table';
import { DestinationService } from '../../destination/destination.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntrySelectDialogComponent } from '../entry-select-dialog/entry-select-dialog.component';
import { OutputService } from './../output.service';
import { OutputDetail, OutputRequest } from '../models/OutputRequest';
import { AuthService } from '../../../auth/auth.service';
import { merge } from 'rxjs';

@Component({
  selector: 'app-output-create',
  templateUrl: './output-create.component.html',
  styleUrl: './output-create.component.scss',
  standalone: false
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
    private employeeService: AuthService,
    private outputService: OutputService,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private router: Router,
    private dialog: MatDialog,
    @Optional() public dialogRef: MatDialogRef<OutputCreateComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  ngOnInit() {
    console.log('OutputCreateComponent Data:', this.data);
    this.initForm();
    this.getDestinations();
    this.getEmployees();

  }

  initForm() {
    let commentValue = '';
    if (this.data && this.data.serviceCode) {
      commentValue = `Ref. Contrato: ${this.data.serviceCode}`;
    }

    this.outputForm = this.fb.group({
      destination_id: ['', Validators.required],
      employee_id: ['', Validators.required],
      date: [this.datePipe.transform(this.date, "yyyy-MM-dd")],
      total: [0.00, { value: 0, readonly: true }],
      comment: [commentValue],
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
    this.employeeService.getUsers().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.employees = respuesta.data.filter((x: { status: number; }) => x.status == 1)
      }
    });
  }

  openMaterialDialog(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '800px';
    dialogConfig.maxWidth = '95dvw';

    const dialogRef = this.dialog.open(EntrySelectDialogComponent, dialogConfig);

    dialogRef.componentInstance.addMaterial.subscribe((selectedMaterial: any) => {
      this.addMaterialToTable(selectedMaterial);
    });
  }

  removeDetail(index: number): void {
    this.outputDetails.removeAt(index);
    this.dataSource.data = this.outputDetails.controls;
  }


  addMaterialToTable(detail: any): void {
    const existingDetail = this.outputDetails.controls.find(control => control.value.id === detail.id);
    if (existingDetail) {
      const newQuantity = existingDetail.get('quantity')!.value + 1;
      existingDetail.get('quantity')!.setValue(newQuantity);
      //  existingDetail.get('subtotal')!.setValue(newQuantity * existingDetail.get('price')!.value);
    } else {
      this.outputDetails.push(this.fb.group({
        ...detail,
        material: detail.name,
        presentation: detail.unit,
        quantity: 1
      }));
    }
    // this.updateTotal();
    this.dataSource.data = this.outputDetails.controls;
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
    // Transforma el FormArray en el formato esperado para output_details
    const outputDetails: OutputDetail[] = formValue.output_details.map((detail: any) => {
      return {
        material_id: detail.id,
        quantity: detail.quantity
      };
    });

    // Prepara el objeto final que se enviará
    const dataToSend: OutputRequest = {
      date: formValue.date,
      destination_id: formValue.destination_id,
      user_id: formValue.employee_id,
      comment: formValue.comment,
      total: formValue.total,
      status: formValue.status,
      output_details: outputDetails
    };

    //Envía los datos mediante el servicio
    this.outputService.addOutput(dataToSend).subscribe(
      {
        next: () => {
          this.showSuccess();
          // Si está abierto como diálogo, cierra el diálogo
          if (this.dialogRef) {
            this.dialogRef.close(true);
          } else {
            // Si no es un diálogo, navega a la lista de salidas
            this.router.navigate(['/dashboard/output/outputs']);
          }
        },
        error: (error) => {
          this.snackbarService.showError(error)
        }
      }
    );
  }

  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro agregado correctamente');
  }


  goOutputs() {
    // Si está abierto como diálogo, cierra el diálogo
    if (this.dialogRef) {
      this.dialogRef.close(false);
    } else {
      // Si no es un diálogo, navega a la lista de salidas
      this.router.navigate(['/dashboard/output/outputs']);
    }
  }

}
