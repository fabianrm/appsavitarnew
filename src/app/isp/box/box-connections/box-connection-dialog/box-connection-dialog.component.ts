import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Box } from '../../Models/BoxResponse';

@Component({
  selector: 'app-box-connection-dialog',
  templateUrl: './box-connection-dialog.component.html',
  standalone: false
})
export class BoxConnectionDialogComponent implements OnInit {
  form: FormGroup;
  boxes: Box[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BoxConnectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { boxes: Box[], startBoxId?: number, endBoxId?: number }
  ) {
    this.boxes = data.boxes;
    this.form = this.fb.group({
      startBoxId: [data.startBoxId || '', Validators.required],
      endBoxId: [data.endBoxId || '', Validators.required],
      color: ['#FF0000', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSave() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
