import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reason } from '../../reason/Models/ReasonResponse';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReasonService } from '../../reason/reason.service';
import { ExpenseCreateComponent } from '../expense-create/expense-create.component';
import { ExpenseService } from '../expense.service';


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
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<ExpenseCreateComponent>) { }


  ngOnInit(): void {

    this.initForm();
  }

  initForm() {
    this.formRq = this.fb.group({
      description: ['', Validators.required],
      amount: ['', Validators.required],
      date: [this.datePipe.transform(this.date, "yyyy-MM-dd"), Validators.required],
      reasonId: ['', Validators.required],
      voutcher: [''],
      note: [''],
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

      this.formRq.patchValue({
        description: expense.data.description,
        amount: expense.data.amount,
        date: expense.data.date,
        reasonId: expense.data.reasonId,
        voutcher: expense.data.voutcher,
        note: expense.data.note,
      })

    });

  }

  enviarDatos() {
    if (this.formRq.valid) {
      this.expenseService.addExpense(this.formRq.value).subscribe(respuesta => {
        this.msgSusscess('Egreso editado correctamente');
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


}
