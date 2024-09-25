import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../../isp/brand/brand.service';
import { CategoryService } from '../../category/category.service';
import { PresentationService } from '../../presentation/presentation.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { MaterialService } from '../material.service';
import { Router } from '@angular/router';
import { Brand } from './../../../isp/brand/Models/BrandResponse';
import { Presentation } from '../../presentation/models/PresentationResponse';
import { Category } from '../../category/models/CategoryResponse';
import { ThemePalette } from '@angular/material/core';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-material-create',
  templateUrl: './material-create.component.html',
  styleUrl: './material-create.component.scss'
})
export class MaterialCreateComponent implements OnInit {

  formMaterial!: FormGroup;
  brands: Brand[] =[];
  presentations: Presentation[] =[];
  categories: Category[] = [];
  
  color: ThemePalette = 'accent';
  checked = true;
  imagePreview: string | ArrayBuffer | null = null;

  fileToUpload: File | null = null;
  uploadMessage: string = '';

  constructor(
    public formulario: FormBuilder,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private presentationService: PresentationService,
    private materialService: MaterialService,
    private snackbarService: SnackbarService,
    private router: Router,
  ) { }


  ngOnInit(): void { 
    this.initForm();
    this.getBrands();
    this.getCategories();
    this.getPresentations();

  }


  initForm() {
    const formControlsConfig = {
      code: ['', Validators.required],
      name: ['', Validators.required],
      category_id: ['', Validators.required],
      presentation_id: ['', Validators.required],
      brand_id: ['', Validators.required],
      min: [''],
      type: ['', Validators.required],
      image: [''],
      status: [1],
    }
    this.formMaterial = this.formulario.group(formControlsConfig);

    Object.keys(formControlsConfig).forEach(key => {
      if (key === 'name' || key === 'serial' || key === 'model') {
        this.formMaterial.get(key)?.valueChanges.subscribe(value => {
          this.formMaterial.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        });
      }
    });
  }

  //Marcas
  getBrands() {
    this.brandService.getBrands().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.brands = respuesta.data
      }
    });
  }

  //Presentaciones
  getPresentations() {
    this.presentationService.getPresentations().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.presentations = respuesta.data
      }
    });
  }

  //Categorias
  getCategories() {
    this.categoryService.getCategories().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.categories = respuesta.data
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
      this.fileToUpload = file;
    }
  }


  onSubmit(): void {
    if (this.formMaterial.valid) {
      if (this.fileToUpload) {
        // Subimos la imagen
        this.materialService.uploadFile(this.fileToUpload).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            // Monitoreamos el progreso de la carga
            const progress = Math.round((100 * event.loaded) / event.total);
            console.log(`Progreso de la carga: ${progress}%`);
          } else if (event.type === HttpEventType.Response && event.body) {
            // Cuando la respuesta ha sido recibida con éxito
            console.log('Respuesta recibida', event.body);

            // Verificamos si el servidor ha enviado la ruta de la imagen
            if (event.body.nombre_archivo) {
              // Insertamos la ruta de la imagen en el formulario
              this.formMaterial.patchValue({ image: event.body.nombre_archivo });

              // Ahora enviamos el formulario con la ruta de la imagen
              this.materialService.addMaterial(this.formMaterial.value).subscribe(respuesta => {
                this.router.navigate(['/dashboard/material/materials']);
                this.showSuccess();
              });
            }
          }
        }, error => {
          console.error('Error al subir la imagen:', error);
        });
      } else {
        // Si no hay archivo, enviamos el formulario directamente
        this.materialService.addMaterial(this.formMaterial.value).subscribe(respuesta => {
          this.router.navigate(['/dashboard/material/materials']);
          this.showSuccess();
        });
      }
    }
  }


  goMaterials() {
    this.router.navigate(['/dashboard/material/materials']);
  }


  uploadFile() {
    if (this.fileToUpload) {
      this.materialService.uploadFile(this.fileToUpload).subscribe({
        next: (response: any) => {
          if (response.status === 'progress') {
            this.uploadMessage = `Progreso: ${response.message}`;
          } else {
            this.uploadMessage = `Imagen cargada correctamente: ${response.nombre_archivo}`;
          }
        },
        error: (err: string) => {
          this.uploadMessage = `Error: ${err}`;
        }
      });
    }
  }


  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro agregado correctamente');
  }


}
