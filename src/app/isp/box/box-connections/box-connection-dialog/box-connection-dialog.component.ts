import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Box } from '../../Models/BoxResponse';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    /* Sticky Search Header Styles */
    ::ng-deep .search-option {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: white !important;
      padding: 8px 16px !important;
      border-bottom: 1px solid #eee;
      height: auto !important;
      line-height: normal !important;
      overflow: visible;
    }
    ::ng-deep .search-option:hover, ::ng-deep .search-option:focus {
      background: white !important;
    }
    ::ng-deep .search-option .mat-pseudo-checkbox {
      display: none !important;
    }
    .pro-search-input {
      width: 100%;
      padding: 10px 36px 10px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 6px;
      outline: none;
      font-size: 14px;
      background: #f8f9fa;
      transition: all 0.2s ease;
      font-family: inherit;
    }
    .pro-search-input:focus {
      background: white;
      border-color: #3f51b5;
      box-shadow: 0 0 0 3px rgba(63, 81, 181, 0.15);
    }
    .search-icon {
      position: absolute;
      right: 24px;
      top: 50%;
      transform: translateY(-50%);
      color: #999;
      pointer-events: none;
      font-size: 18px;
    }
  `]
})
export class BoxConnectionDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  boxes: Box[] = [];
  
  predefinedColors: string[] = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', 
    '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', 
    '#009688', '#4CAF50', '#8BC34A', '#CDDC39', 
    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', 
    '#795548', '#9E9E9E', '#607D8B', '#000000'
  ];

  /* Controls for the box filters */
  public startBoxFilterCtrl: FormControl = new FormControl();
  public endBoxFilterCtrl: FormControl = new FormControl();

  /* Lists of filtered boxes */
  public filteredStartBoxes: ReplaySubject<Box[]> = new ReplaySubject<Box[]>(1);
  public filteredEndBoxes: ReplaySubject<Box[]> = new ReplaySubject<Box[]>(1);

  protected _onDestroy = new Subject<void>();

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

  ngOnInit(): void {
    // Load initial box list
    this.filteredStartBoxes.next(this.boxes.slice());
    this.filteredEndBoxes.next(this.boxes.slice());

    // Listen for search field value changes
    this.startBoxFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBoxes(this.startBoxFilterCtrl.value, this.filteredStartBoxes);
      });

    this.endBoxFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBoxes(this.endBoxFilterCtrl.value, this.filteredEndBoxes);
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterBoxes(search: string, subject: ReplaySubject<Box[]>) {
    if (!this.boxes) {
      return;
    }
    if (!search) {
      subject.next(this.boxes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    subject.next(
      this.boxes.filter(box => box.name.toLowerCase().indexOf(search) > -1)
    );
  }

  onSave() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
