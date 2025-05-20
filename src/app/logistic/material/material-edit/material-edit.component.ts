import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Brand } from '../../../isp/brand/Models/BrandResponse';
import { Presentation } from '../../presentation/models/PresentationResponse';
import { Category } from '../../category/models/CategoryResponse';
import { ThemePalette } from '@angular/material/core';
import { BrandService } from '../../../isp/brand/brand.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../category/category.service';
import { PresentationService } from '../../presentation/presentation.service';
import { MaterialService } from '../material.service';
import { Material } from '../models/MaterialResponse';

@Component({
    selector: 'app-material-edit',
    templateUrl: './material-edit.component.html',
    styleUrl: './material-edit.component.scss',
    standalone: false
})
export class MaterialEditComponent {

  formMaterial!: FormGroup;
  brands: Brand[] = [];
  presentations: Presentation[] = [];
  categories: Category[] = [];

  color: ThemePalette = 'accent';
  checked = true;
  imagePreview: string | ArrayBuffer | null = null;

  id?: number;
  dataMaterial?: Material;

  constructor(
    public formulario: FormBuilder,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private presentationService: PresentationService,
    private materialService: MaterialService,
    private snackbarService: SnackbarService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getBrands();
    this.getCategories();
    this.getPresentations();
    this.getMaterialById();

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


  //Obtener Material por id
  getMaterialById() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.id = +idParam; // Usa el símbolo "+" para convertir a número
        this.fetchDetails(this.id); // Llama a la función para obtener los detalles del box
      } else {
        // Manejar el caso cuando idParam es null, asignando un valor por defecto o manejando el error
        console.error('ID parameter is null');
      }
    });
  }


  fetchDetails(id: number) {
    this.materialService.getMaterialById(id).subscribe((respuesta) => {
      this.dataMaterial = respuesta.data;
      //Llenamos el formEdit
      this.formMaterial.patchValue({
        code: this.dataMaterial.code,
        name: this.dataMaterial.name,
        category_id: this.dataMaterial.category.id,
        presentation_id: this.dataMaterial.presentation.id,
        brand_id: this.dataMaterial.brand.id,
        min: this.dataMaterial.min,
        type: this.dataMaterial.type,
        status: this.dataMaterial.status,
      });
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
      this.materialService.updateMaterial( this.id!, this.formMaterial.value).subscribe(respuesta => {
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
    this.snackbarService.showSuccess('Registro actualizado correctamente');
  }



}
