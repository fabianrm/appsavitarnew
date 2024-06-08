import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from './../expense.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ReasonService } from '../../reason/reason.service';
import { Reason } from '../../reason/Models/ReasonResponse';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expense-create',
  templateUrl: './expense-create.component.html',
  styleUrl: './expense-create.component.scss'
})
export class ExpenseCreateComponent {

  formRq!: FormGroup;
  date = new Date();
  reasons: Reason[] = [];
  tipo: string = '';

  constructor(
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public getType: string,
    private expenseService: ExpenseService,
    private reasonService: ReasonService,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<ExpenseCreateComponent>) { }


  ngOnInit(): void {
    this.getReasons();
    this.initForm();
  }


  initForm() {

    const formControlsConfig = {
      description: ['', Validators.required],
      amount: ['', Validators.required],
      date: [this.datePipe.transform(this.date, "yyyy-MM-dd"), Validators.required],
      reasonId: ['', Validators.required],
      voutcher: [''],
      note: [''],
      status: [true],
    }

    this.formRq = this.fb.group(formControlsConfig);

    Object.keys(formControlsConfig).forEach(key => {
      if (key === 'note' || key === 'description' || key === 'voutcher') {
        this.formRq.get(key)?.valueChanges.subscribe(value => {
          this.formRq.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        });
      }
    });
  }


  getReasons() {
    this.reasonService.getReasons().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.reasons = respuesta.data.filter(item => item.type === this.getType)
      }
    });
  }


  enviarDatos() {

    const formData = this.formRq.value;
    const purchaseDate = new Date(formData.date).toISOString().split('T')[0];

    const dataToSend = {
      ...formData,
      date: purchaseDate,

    };

    if (this.formRq.valid) {
      this.expenseService.addExpense(dataToSend).subscribe(respuesta => {
        this.msgSusscess('Egreso registrado correctamente');
        this.dialogRef.close();
        console.log(respuesta);
      });
    }
  }

  msgSusscess(mensaje: string) {
    this._snackBar.open(mensaje, 'SAVITAR', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    })
  }

  close() {
    this.dialogRef.close();
  }



}
