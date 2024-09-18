import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { CategoryTicketService } from '../categoryTicket.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-category-ticket',
  templateUrl: './create-category-ticket.component.html',
  styleUrl: './create-category-ticket.component.scss'
})
export class CreateCategoryTicketComponent {

  formCategory!: FormGroup;
  color: ThemePalette = 'accent';
  checked = true;
  disabled = false;


  constructor(public formulario: FormBuilder,
    private categoryTicketService: CategoryTicketService,
    @Inject(MAT_DIALOG_DATA) public getData: any,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<CreateCategoryTicketComponent>
    ) { }


  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formCategory = this.formulario.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: [true],
    });
  }


  enviarDatos() {
    if (this.formCategory.valid) {
      this.categoryTicketService.addCategoryTickets(this.formCategory.value).subscribe(respuesta => {
        this.showSuccess();
        this.dialogRef.close();
      });
    }
  }

  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro agregado correctamente');
  }


}
