import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from './../expense.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expense-create',
  templateUrl: './expense-create.component.html',
  styleUrl: './expense-create.component.scss'
})
export class ExpenseCreateComponent {

  formRq!: FormGroup;
  date = new Date();

  constructor(
    public fb: FormBuilder,
    private expenseService: ExpenseService,
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
      reason: ['', Validators.required],
      voutcher: [''],
      note: [''],
    });
  }


  enviarDatos() {
    if (this.formRq.valid) {
      this.expenseService.addExpense(this.formRq.value).subscribe(respuesta => {
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




}
