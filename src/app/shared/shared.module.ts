import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { MatIconModule } from '@angular/material/icon';
import { EnterpriseImagePipe } from './pipes/enterprise-image.pipe';
import { MaterialImagePipe } from './pipes/material-image.pipe';

@NgModule({
  declarations: [
    SnackbarComponent,
    EnterpriseImagePipe,
    MaterialImagePipe,

  ],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [
    SnackbarComponent,
    EnterpriseImagePipe,

  ]
})
export class SharedModule { }
