import { Component, Inject, OnInit } from '@angular/core';
import { InvoiceService } from '../invoice.service';
import { Invoice } from '../Models/InvoiceResponse';
import { FormBuilder, FormGroup} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { now } from 'moment';

@Component({
  selector: 'app-invoice-paid',
  templateUrl: './invoice-paid.component.html',
  styleUrl: './invoice-paid.component.scss'
})
export class InvoicePaidComponent implements OnInit {

  formPaid!: FormGroup;
  finalPrice: number = this.getData.price;
  amount: number = 0;


  constructor(public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public getData: Invoice,
    private invoiceService: InvoiceService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<InvoicePaidComponent>,) { }

  ngOnInit() {
   
    this.initForm();
  }

  initForm() {
    this.formPaid = this.fb.group({
      discount:[0],
      receipt: [''],
      note: [''],
      status: ['pagada'],
    });

    this.formPaid.get('discount')?.valueChanges.subscribe(value => {
      this.updatePrice(value);
    });
  }

  //Actualiza el monto final
  updatePrice(discount: number) {
    if (discount >= 0 && discount <= this.getData.price) {
      this.finalPrice = this.getData.price - discount;
      this.amount = this.finalPrice;
    } else {
      this.finalPrice = this.getData.price; // En caso de que el descuento no sea válido
      this.amount = this.finalPrice;
    }
  }


  enviarDatos() {
    const formData = this.formPaid.value;
    const currentDate = new Date().toISOString().split('T')[0]; // Formato 'year-month-day'

    const dataToSend = {
      ...formData,
      paid_dated: currentDate,
      amount: this.finalPrice
    };

    
    if (this.formPaid.valid) {
      this.invoiceService.paidInvoice(this.getData.invoiceId,dataToSend).subscribe(respuesta => {
        this.msgSusscess('Factura pagada correctamente');
        this.dialogRef.close();
        // console.log(respuesta);
      }, error => {
        console.error('Error al guardar los datos:', error);
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
