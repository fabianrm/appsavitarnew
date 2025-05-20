import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../ticket.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Ticket } from '../Models/TicketResponse';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../auth/Models/UserResponse';
import { Employee } from '../../../logistic/employee/models/EmployeeResponse';

@Component({
    selector: 'app-assign-ticket',
    templateUrl: './assign-ticket.component.html',
    styleUrl: './assign-ticket.component.scss',
    standalone: false
})
export class AssignTicketComponent {

  formAssign!: FormGroup;
  technician_id!: number;
  users: Employee[] = [];
  date = new Date();
  fechaDate1 = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
  fechaDate : Date;


  constructor(public fb: FormBuilder,
    private ticketService: TicketService,
    private userService: AuthService,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public getData: Ticket,
    private dialogRef: MatDialogRef<AssignTicketComponent>,) { 
    
    // Ajusta la hora a 0 para evitar desfase
    this.fechaDate = new Date(this.date.setHours(0, 0, 0, 0));

    // Inicializa el formulario
    this.initForm();
    console.log('Fecha asignada:', this.fechaDate);
    }

  ngOnInit() {
    this.getUsers();
   // this.initForm();
  }

  initForm() {
    this.formAssign = this.fb.group({
      admin_id: [this.UserID],
      technician_id: ['', Validators.required],
      expiration: [this.fechaDate1], 
      //expiration: [this.getLocalDate(this.fechaDate)],
    });

  }

  getLocalDate(date: Date): Date {
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return localDate;
  }



  //Usuario
  get UserID() {
    return localStorage.getItem('id_user');
  }

  enviarDatos() {
    const formData = this.formAssign.value;
    const expirationDate = new Date(formData.expiration).toISOString().split('T')[0];

    const dataToSend = {
      ...formData,
      expiration: expirationDate,
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
