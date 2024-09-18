import { Component, Inject } from '@angular/core';
import { CategoryTicketService } from '../categoryTicket.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { CreateCategoryTicketComponent } from '../create-category-ticket/create-category-ticket.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { CategoryTicket } from '../Models/CategoryTicketResponse';

@Component({
  selector: 'app-edit-category-ticket',
  templateUrl: './edit-category-ticket.component.html',
  styleUrl: './edit-category-ticket.component.scss'
})
export class EditCategoryTicketComponent {

  formCategory!: FormGroup;
  color: ThemePalette = 'accent';
  checked = this.getData.status;
  disabled = false;
  id?: number;

  dataCategory?: CategoryTicket;


  constructor(public formulario: FormBuilder,
    private categoryTicketService: CategoryTicketService,
    @Inject(MAT_DIALOG_DATA) public getData: CategoryTicket,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<EditCategoryTicketComponent>
  ) { }


  ngOnInit(): void {
    this.initForm();
   // console.log(this.getData);
  
  }

  initForm() {
    this.formCategory = this.formulario.group({
      name: [this.getData.name, Validators.required],
      description: [this.getData.description, Validators.required],
      status: [this.checked],
    });
  }





  enviarDatos() {
    if (this.formCategory.valid) {
      this.categoryTicketService.updateCategoryTickets(this.getData.id, this.formCategory.value).subscribe(respuesta => {
        this.showSuccess();
        this.dialogRef.close();
      });
    }
  }

  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro actualizado correctamente');
  }

}
