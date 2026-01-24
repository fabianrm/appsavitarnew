import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface FilterColor {
  color: string;
  selected: boolean;
}

@Component({
  selector: 'app-box-route-filter-dialog',
  templateUrl: './box-route-filter-dialog.component.html',
  styles: [`
    .color-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    .color-swatch {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      margin-right: 10px;
      border: 1px solid #ddd;
    }
    .actions {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
  `],
  standalone: false
})
export class BoxRouteFilterDialogComponent implements OnInit {
  colors: FilterColor[] = [];

  constructor(
    public dialogRef: MatDialogRef<BoxRouteFilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { colors: FilterColor[] }
  ) {
    // Clone to avoid mutating directly
    this.colors = data.colors.map(c => ({ ...c }));
  }

  ngOnInit(): void {}

  toggleAll(select: boolean) {
    this.colors.forEach(c => c.selected = select);
  }

  apply() {
    this.dialogRef.close(this.colors);
  }

  close() {
    this.dialogRef.close();
  }
}
