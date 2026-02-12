import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { Box } from '../../Models/BoxResponse';
import { BoxRoutePhoto } from '../../Models/BoxRoutePhoto';
import { BoxRoutePhotoService } from '../../box-route-photo.service';
import { PhotoViewerModalComponent } from '../photo-viewer-modal/photo-viewer-modal.component';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-box-connection-dialog',
  templateUrl: './box-connection-dialog.component.html',
  standalone: false,
  styles: [
    `
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
        transition:
          transform 0.2s,
          border-color 0.2s;
      }
      .color-swatch:hover {
        transform: scale(1.1);
      }
      .color-swatch.selected {
        border-color: #333;
        transform: scale(1.1);
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
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
      ::ng-deep .search-option:hover,
      ::ng-deep .search-option:focus {
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
      .photo-upload-section {
        margin: 16px 0;
        padding: 16px;
        border: 2px dashed #ddd;
        border-radius: 8px;
        background: #fafafa;
      }
      .photo-upload-btn {
        width: 100%;
      }
      .photo-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 12px;
        margin-top: 12px;
      }
      .photo-thumbnail {
        position: relative;
        width: 100%;
        padding-top: 100%;
        border-radius: 8px;
        overflow: hidden;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
      }
      .photo-thumbnail:hover {
        transform: scale(1.05);
      }
      .photo-thumbnail img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .photo-delete-btn {
        position: absolute;
        top: 4px;
        right: 4px;
        background: rgba(255, 255, 255, 0.9);
        z-index: 10;
        min-width: 32px;
        width: 32px;
        height: 32px;
        padding: 0;
      }
      .photo-delete-btn mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        line-height: 18px;
      }
      @media (max-width: 768px) {
        .photo-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
})
export class BoxConnectionDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  boxes: Box[] = [];

  predefinedColors: string[] = [
    '#F44336',
    '#E91E63',
    '#9C27B0',
    '#673AB7',
    '#3F51B5',
    '#2196F3',
    '#03A9F4',
    '#00BCD4',
    '#009688',
    '#4CAF50',
    '#8BC34A',
    '#CDDC39',
    '#FFEB3B',
    '#FFC107',
    '#FF9800',
    '#FF5722',
    '#795548',
    '#9E9E9E',
    '#607D8B',
    '#000000',
  ];

  /* Controls for the box filters */
  public startBoxFilterCtrl: FormControl = new FormControl();
  public endBoxFilterCtrl: FormControl = new FormControl();

  /* Lists of filtered boxes */
  public filteredStartBoxes: ReplaySubject<Box[]> = new ReplaySubject<Box[]>(1);
  public filteredEndBoxes: ReplaySubject<Box[]> = new ReplaySubject<Box[]>(1);

  protected _onDestroy = new Subject<void>();

  // Photo management
  photos: BoxRoutePhoto[] = [];
  selectedFiles: File[] = [];
  routeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BoxConnectionDialogComponent>,
    private photoService: BoxRoutePhotoService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      boxes: Box[];
      startBoxId?: number;
      endBoxId?: number;
      route?: any;
    },
  ) {
    this.boxes = data.boxes;

    if (data.route) {
      this.routeId = data.route.id;
      this.form = this.fb.group({
        startBoxId: [data.route.start_box_id, Validators.required],
        endBoxId: [data.route.end_box_id, Validators.required],
        color: [data.route.color, Validators.required],
        notes: [data.route.notes || ''],
        type: [data.route.type || 'derivada', Validators.required],
      });
    } else {
      this.form = this.fb.group({
        startBoxId: [data.startBoxId || '', Validators.required],
        endBoxId: [data.endBoxId || '', Validators.required],
        color: ['#FF0000', Validators.required],
        notes: [''],
        type: ['derivada', Validators.required],
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
        this.filterBoxes(
          this.startBoxFilterCtrl.value,
          this.filteredStartBoxes,
        );
      });

    this.endBoxFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBoxes(this.endBoxFilterCtrl.value, this.filteredEndBoxes);
      });

    // Load photos if editing existing route
    if (this.routeId) {
      this.loadPhotos();
    }
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
      this.boxes.filter((box) => box.name.toLowerCase().indexOf(search) > -1),
    );
  }

  loadPhotos() {
    if (!this.routeId) return;

    this.photoService.getPhotos(this.routeId).subscribe(
      (photos) => {
        this.photos = photos;
      },
      (error) => {
        console.error('Error loading photos:', error);
      },
    );
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedFiles = Array.from(files);
    }
  }

  uploadSelectedPhotos() {
    if (!this.routeId || this.selectedFiles.length === 0) return;

    let uploadCount = 0;
    const total = this.selectedFiles.length;

    this.selectedFiles.forEach((file) => {
      this.photoService.uploadPhoto(this.routeId!, file).subscribe(
        (response) => {
          uploadCount++;
          if (uploadCount === total) {
            this.selectedFiles = [];
            this.loadPhotos();
            Swal.fire({
              icon: 'success',
              title: 'Fotos subidas correctamente',
              timer: 1500,
              showConfirmButton: false,
            });
          }
        },
        (error) => {
          console.error('Error uploading photo:', error);
          Swal.fire('Error', 'Error al subir la foto', 'error');
        },
      );
    });
  }

  viewPhoto(photo: BoxRoutePhoto) {
    const photoUrl = this.photoService.getPhotoUrl(photo.path);
    this.dialog.open(PhotoViewerModalComponent, {
      width: '90vw',
      maxWidth: '1200px',
      height: '90vh',
      data: { photoUrl },
    });
  }

  deletePhoto(photo: BoxRoutePhoto, event: Event) {
    event.stopPropagation();

    Swal.fire({
      title: '¿Eliminar foto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.photoService.deletePhoto(photo.id).subscribe(
          () => {
            this.photos = this.photos.filter((p) => p.id !== photo.id);
            Swal.fire({
              icon: 'success',
              title: 'Foto eliminada',
              timer: 1500,
              showConfirmButton: false,
            });
          },
          (error) => {
            console.error('Error deleting photo:', error);
            Swal.fire('Error', 'Error al eliminar la foto', 'error');
          },
        );
      }
    });
  }

  getPhotoUrl(photo: BoxRoutePhoto): string {
    return this.photoService.getPhotoUrl(photo.path);
  }

  onSave() {
    if (this.form.valid) {
      const formData = this.form.value;
      // Include route ID and selected files in the response
      this.dialogRef.close({
        ...formData,
        routeId: this.routeId,
        filesToUpload: this.selectedFiles,
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
