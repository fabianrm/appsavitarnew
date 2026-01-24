import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Box } from '../../Models/BoxResponse';

@Component({
  selector: 'app-box-connection-dialog',
  templateUrl: './box-connection-dialog.component.html',
  standalone: false,
  styles: [`
    .color-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(30px, 1fr));
      gap: 8px;
      margin-top: 8px;
    }
    .color-swatch {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid transparent;
      transition: transform 0.2s, border-color 0.2s;
    }
    .color-swatch:hover {
      transform: scale(1.1);
    }
    .color-swatch.selected {
      border-color: #333;
      transform: scale(1.1);
      box-shadow: 0 0 4px rgba(0,0,0,0.4);
    }
    .custom-color-btn {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: #fff;
      border: 1px solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .hidden-input {
      visibility: hidden;
      width: 0;
      height: 0;
      position: absolute;
    }
  `]
})
export class BoxConnectionDialogComponent implements OnInit {
  form: FormGroup;
  boxes: Box[] = [];
  
  predefinedColors: string[] = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', 
    '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', 
    '#009688', '#4CAF50', '#8BC34A', '#CDDC39', 
    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', 
    '#795548', '#9E9E9E', '#607D8B', '#000000'
  ];

  /* 
    Use styles array directly in component metadata if preferred, 
    but since I am editing the class, I will just ensure the template 
    can acccess these properties. 
    Actually, standard Angular practice for inline styles is in the @Component decorator.
    I should edit the decorator first.
  */

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BoxConnectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { boxes: Box[], startBoxId?: number, endBoxId?: number, route?: any }
  ) {
    this.boxes = data.boxes;
    
    if (data.route) {
        this.form = this.fb.group({
            startBoxId: [data.route.start_box_id, Validators.required],
            endBoxId: [data.route.end_box_id, Validators.required],
            color: [data.route.color, Validators.required],
            notes: [data.route.notes || '']
        });
    } else {
        this.form = this.fb.group({
            startBoxId: [data.startBoxId || '', Validators.required],
            endBoxId: [data.endBoxId || '', Validators.required],
            color: ['#FF0000', Validators.required],
            notes: ['']
        });
    }
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
