import { Component, inject } from '@angular/core';
import { RouterService } from '../router.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SyncResponse } from '../Models/SyncResponse';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-infiltrados',
  standalone: false,
  templateUrl: './infiltrados.component.html',
  styleUrl: './infiltrados.component.scss'
})
export class InfiltradosComponent {
  private routerService = inject(RouterService);
  private dialogRef = inject(MatDialogRef<InfiltradosComponent>); // Inyecta MatDialogRef
  id = inject(MAT_DIALOG_DATA) as number; // Inyecta el data sin constructor

  resMK: SyncResponse = {
    success: false,
    message: '',
    procesados: 0,
    total: 0,
    usuarios_discrepantes: [],
  };

  ngOnInit(): void {
    this.getInfiltrados();
  }

  getInfiltrados() {
    this.routerService.getInfiltrados(this.id).subscribe({
      next: (respuesta) => {
        console.log(this.resMK);
        this.resMK = respuesta;
      },

      error: (error) => {
        Swal.fire('Error ☹️', error.message, 'error');
      },

    });

  }

  onClose() {
    this.dialogRef.close();
  }


}
