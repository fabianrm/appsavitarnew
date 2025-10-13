import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoxService } from '../box.service';
import { BoxServiceResponse } from '../Models/BoxService';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-show-services',
  templateUrl: './show-services.component.html',
  styleUrls: ['./show-services.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule,
    MatButtonModule,
  ],
})
export class ShowServicesComponent implements OnInit {

  services: BoxServiceResponse[] = [];
  isLoading = true;

  constructor(
    public dialogRef: MatDialogRef<ShowServicesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number, name: string },
    private boxService: BoxService
  ) { }

  ngOnInit(): void {
    this.getContractsByBox(this.data.id);
  }

  getContractsByBox(id: number): void {
    this.boxService.getServicesByBox(id).subscribe({
      next: (response: BoxServiceResponse[]) => {
        this.services = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error obteniendi servicios:', error);
        this.isLoading = false;
      }
    }
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}