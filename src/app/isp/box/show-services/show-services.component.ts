import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoxService } from '../box.service';
import { BoxServiceResponse } from '../Models/BoxService';

@Component({
  selector: 'app-show-services',
  templateUrl: './show-services.component.html',
  styleUrls: ['./show-services.component.scss'],
  standalone: false
})
export class ShowServicesComponent implements OnInit {

  services: BoxServiceResponse[] = [];
  isLoading = true;

  constructor(
    public dialogRef: MatDialogRef<ShowServicesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private boxService: BoxService
  ) { }

  ngOnInit(): void {
    this.getContractsByBox(this.data.id);
  }

  getContractsByBox(id: number): void {
    this.boxService.getServicesByBox(id).subscribe(
      (respuesta: BoxServiceResponse[]) => {
        console.log(respuesta);

        this.services = respuesta;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching services:', error);
        this.isLoading = false;
      }
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}