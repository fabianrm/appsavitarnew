import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExpenseService } from '../expense.service';
import { Expense } from '../Models/ExpenseResponse';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expense-paid',
  templateUrl: './expense-paid.component.html',
  styleUrl: './expense-paid.component.scss'
})
export class ExpensePaidComponent {


  formPaid!: FormGroup;
  finalPrice: number = this.getData.amount;
  amount: number = 0;
  date = new Date();


  constructor(public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public getData: Expense,
    private expenseService: ExpenseService,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private dialogRef: MatDialogRef<ExpensePaidComponent>,) { }


  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formPaid = this.fb.group({
      voutcher: ['', Validators.required],
      note: [''],
      datePaid: [this.datePipe.transform(this.date, "yyyy-MM-dd"), Validators.required],
      status: [true],
    });

  }



  enviarDatos() {

    const formData = this.formPaid.value;
    const purchaseDate = new Date(formData.datePaid).toISOString().split('T')[0];

    const dataToSend = {
      ...formData,
      datePaid: purchaseDate,

    };

    if (this.formPaid.valid) {
      this.expenseService.updatePaid(this.getData.id, dataToSend).subscribe(respuesta => {
        this.msgSusscess('Pago registrado correctamente');
        this.dialogRef.close();
        //console.log(respuesta);
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


  onCancel() {
    console.log(this.formPaid.get('amount'));
    // console.log(this.formPaid.value);

    this.dialogRef.close();
  }



}
