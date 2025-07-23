import { Component, inject } from '@angular/core';
import { RouterService } from '../router.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TestResponse } from '../Models/TestResponse';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-test',
  standalone: false,
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {

  private routerService = inject(RouterService);
  private dialogRef = inject(MatDialogRef<TestComponent>); // Inyecta MatDialogRef
  id = inject(MAT_DIALOG_DATA) as number; // Inyecta el data sin constructor

  testMK: TestResponse = {
    ip: '',
    usuario: '',
    conectado: false,
    mensaje: '',
    system_info: {
      headers: {},
      original: [],
      exception: null
    }
  };

  ngOnInit(): void {
    this.test();
  }

  test() {
    this.routerService.getTestConnection(this.id).subscribe({
      next: (respuesta) => {
        console.log(this.testMK);
        this.testMK = respuesta;
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
