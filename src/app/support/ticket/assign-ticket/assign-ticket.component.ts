import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../ticket.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Ticket } from '../Models/TicketResponse';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../auth/Models/UserResponse';

@Component({
  selector: 'app-assign-ticket',
  templateUrl: './assign-ticket.component.html',
  styleUrl: './assign-ticket.component.scss'
})
export class AssignTicketComponent {

  formAssign!: FormGroup;
  technician_id!: number;
  users : User[] = [];

  constructor(public fb: FormBuilder,
    private ticketService: TicketService,
    private userService: AuthService,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public getData: Ticket,
    private dialogRef: MatDialogRef<AssignTicketComponent>,) { }

  ngOnInit() {
    this.getUsers();
    this.initForm();
  }

  initForm() {
    this.formAssign = this.fb.group({
      admin_id: [this.UserID],
      technician_id: ['', Validators.required],
    });

  }


  //Usuario
  get UserID() {
    return localStorage.getItem('id_user');
  }

  enviarDatos() {
    const formData = this.formAssign.value;

    const dataToSend = {
      ...formData,
    };

    if (this.formAssign.valid) {
      Swal.fire({
        title: "Asignar Ticket",
        text: "Desea asignar el técnico al Ticket?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#43a047",
        cancelButtonColor: "#e91e63",
        confirmButtonText: "Si, asignar!"
      }).then((result) => {
        if (result.isConfirmed) {
          this.ticketService.assignTicket(this.getData.id, dataToSend).subscribe(respuesta => {
            Swal.fire(
              'Guardado!',
              'Técnico asignado correctamente.',
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

  getUsers() {
    this.userService.getUsers().subscribe((respuesta) => {
      //  console.log(respuesta.data)
      if (respuesta.data.length > 0) {
        this.users = respuesta.data;
      }
    });
  }


  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro agregado correctamente');
  }


  onCancel() {
    this.dialogRef.close();
  }

}
