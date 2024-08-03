import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from './snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  showError(message: string) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 3000,
      data: { message: message, icon: 'error' },
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

  showSuccess(message: string) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 3000,
      data: { message: message, icon: 'check_circle' },
      panelClass: ['success-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

  showInfo(message: string) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 3000,
      data: { message: message, icon: 'info' },
      panelClass: ['info-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

}
