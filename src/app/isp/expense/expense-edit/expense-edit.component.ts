import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reason } from '../../reason/Models/ReasonResponse';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReasonService } from '../../reason/reason.service';
import { ExpenseCreateComponent } from '../expense-create/expense-create.component';
import { ExpenseService } from '../expense.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';


@Component({
  selector: 'app-expense-edit',
  templateUrl: './expense-edit.component.html',
  styleUrl: './expense-edit.component.scss'
})
export class ExpenseEditComponent {

  formRq!: FormGroup;
  date = new Date();
  reasons: Reason[] = [];


  constructor(
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public getId: number,
    private expenseService: ExpenseService,
    private reasonService: ReasonService,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<ExpenseCreateComponent>) { }


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    // this.formRq = this.fb.group({

    const formControlsConfig = {
      description: ['', Validators.required],
      amount: ['', Validators.required],
      date: [this.datePipe.transform(this.date, "yyyy-MM-dd"), Validators.required],
      reasonId: ['', Validators.required],
      voutcher: [''],

      note: [''],
    };

    this.formRq = this.fb.group(formControlsConfig);

    Object.keys(formControlsConfig).forEach(key => {
      if (key === 'note' || key === 'description' || key === 'voutcher') {
        this.formRq.get(key)?.valueChanges.subscribe(value => {
          this.formRq.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        });
      }
    });

    this.getReasons();
    this.getExpenseById(this.getId)
  }


  getReasons() {
    this.reasonService.getReasons().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.reasons = respuesta.data
      }
    });
  }

  getExpenseById(id: number) {



    this.expenseService.getExpenseById(id).subscribe(expense => {

      let fechaDate = new Date(expense.data.date + ' 0:00:00');

      this.formRq.patchValue({
        description: expense.data.description,
        amount: expense.data.amount,
        date: fechaDate,
        reasonId: expense.data.reasonId,
        voutcher: expense.data.voutcher,
        note: expense.data.note,
      })

    });

  }



  enviarDatos() {

    const formData = this.formRq.value;
    const purchaseDate = new Date(formData.date).toISOString().split('T')[0];

    const dataToSend = {
      ...formData,
      date: purchaseDate,
      datePaid: this.datePipe.transform(this.date, "yyyy-MM-dd"),

    };

    if (this.formRq.valid) {
      this.expenseService.updateExpense(this.getId, dataToSend).subscribe(respuesta => {
        this.showSuccess();
        this.dialogRef.close();
        console.log(respuesta);
      });
    }
  }



  close() {
    this.dialogRef.close();
  }

  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro editado correctamente');
  }


}
