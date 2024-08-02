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
      serial: [''],
      model: [''],
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
    }
  }



  onSubmit(): void {
    if (this.formMaterial.valid) {
      this.materialService.addMaterial(this.formMaterial.value).subscribe(respuesta => {
        this.router.navigate(['/dashboard/material/materials']);
        this.showSuccess();
      });
    }
  }

  goMaterials() {
    this.router.navigate(['/dashboard/material/materials']);
  }

  showError() {
    this.snackbarService.showError('☹️ Ocurrio un error');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Registro agregado correctamente');
  }


}
