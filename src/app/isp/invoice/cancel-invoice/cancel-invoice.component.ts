import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Invoice } from '../Models/InvoiceResponse';
import { InvoiceService } from '../invoice.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cancel-invoice',
  templateUrl: './cancel-invoice.component.html',
  styleUrl: './cancel-invoice.component.scss'
})
export class CancelInvoiceComponent implements OnInit {


  constructor(public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public getData: Invoice,
    private invoiceService: InvoiceService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<CancelInvoiceComponent>,) { }
  
  formPaid!: FormGroup;
  finalPrice: number = this.getData.price;
  receipt = this.getData.receipt;

  ngOnInit(): void {
    this.initForm();
   
  }

  initForm() {
    this.formPaid = this.fb.group({
      note: [''],
    });
  }


  //Enviar datos
  enviarDatos() {
    const formData = this.formPaid.value;

    if (this.formPaid.valid) {
      Swal.fire({
        title: "Esta seguro?",
        text: "Se anulará la factura!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#43a047",
        cancelButtonColor: "#e91e63",
        confirmButtonText: "Si, anular factura!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.invoiceService.cancelInvoice(this.getData.invoiceId, formData).subscribe(respuesta => {
            Swal.fire(
              'Anulado!',
              'La factura se ha anulado con éxito.',
              'success'
            ).then(r => {
              if (r) {
                this.dialogRef.close();
              }
            })
          }, error => {
            console.error('Error al guardar los datos:', error);
          });
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

}
