import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from './../expense.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ReasonService } from '../../reason/reason.service';
import { Reason } from '../../reason/Models/ReasonResponse';
import { SnackbarService } from '../../shared/snackbar/snackbar.service';


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
    private snackbarService: SnackbarService,
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
      datePaid: this.getType === 'variable' ? [this.datePipe.transform(this.date, "yyyy-MM-dd")] : null,
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
        this.reasons = respuesta.data.filter(item => item.type === this.getType && item.status === 1)
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
        this.showSuccess();
        this.dialogRef.close();
       // console.log(respuesta);
      });
    }
  }


  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro agregado correctamente');
  }


  close() {
    this.dialogRef.close();
  }



}
