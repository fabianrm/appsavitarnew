import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-photo-viewer-modal',
  templateUrl: './photo-viewer-modal.component.html',
  styleUrls: ['./photo-viewer-modal.component.scss'],
  standalone: false,
})
export class PhotoViewerModalComponent {
  photoUrl: string;

  constructor(
    private dialogRef: MatDialogRef<PhotoViewerModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { photoUrl: string },
  ) {
    this.photoUrl = data.photoUrl;
  }

  close() {
    this.dialogRef.close();
  }
}
