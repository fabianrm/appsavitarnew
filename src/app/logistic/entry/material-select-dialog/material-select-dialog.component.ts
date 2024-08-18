import { Component, OnInit } from '@angular/core';
import { Material, MaterialResponse } from '../../material/models/MaterialResponse';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialService } from '../../material/material.service';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { Warehouse } from '../../warehouse/models/WarehouseResponse';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-material-select-dialog',
  templateUrl: './material-select-dialog.component.html',
  styleUrl: './material-select-dialog.component.scss'
})
export class MaterialSelectDialogComponent implements OnInit {

  materialForm!: FormGroup;
  materials: Material[] = [];
  warehouses: Warehouse[] = [];

  filteredMaterial!: Observable<Material[]>;
  
  constructor(public dialogRef: MatDialogRef<MaterialSelectDialogComponent>,
    private fb: FormBuilder, private materialService: MaterialService,
    private warehouseService: WarehouseService,) {}

  initForm() {
    const formControlsConfig = {
      material_id: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
      subtotal: ['',],
      warehouse_id: ['', Validators.required],
      location: ['', Validators.required]
    }
    this.materialForm = this.fb.group(formControlsConfig);

    Object.keys(formControlsConfig).forEach(key => {
      if ( key === 'location' ) {
        this.materialForm.get(key)?.valueChanges.subscribe(value => {
          this.materialForm.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        });
      }
    });

    this.materialForm.get('quantity')!.valueChanges.subscribe(() => this.updateSubtotal());
    this.materialForm.get('price')!.valueChanges.subscribe(() => this.updateSubtotal());

    //Filtrar combo box por name 
    this.filteredMaterial = this.materialForm.get('material_id')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.name)),
      map(name => (name ? this._filterMaterial(name) : this.materials.slice()))
    );

  }


  ngOnInit() {
    this.initForm();
    this.getMaterials();
    this.getWarehouses();
  }

  getMaterials() {
    this.materialService.getMaterials().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.materials = respuesta.data;
      }
    });
  }

  getWarehouses() {
    this.warehouseService.getWarehouses().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.warehouses = respuesta.data;
      }
    });
  }


  updateSubtotal(): void {
    const quantity = this.materialForm.get('quantity')!.value;
    const price = this.materialForm.get('price')!.value;
    const subtotal = quantity * price;
    this.materialForm.get('subtotal')!.setValue(subtotal);

  }


  onSubmit(): void {

    const formData = this.materialForm.value;
    const materialId = this.MaterialIdValue;

    const dataToSend = {
      ...formData,
      material_id: materialId,
    };


    if (this.materialForm.valid) {
      this.dialogRef.close(dataToSend);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  displayFn(material: Material): string {
    return material && material.name ? material.name : '';
  }

  private _filterMaterial(name: string): Material[] {
    const filterValue = name.toLowerCase();
    return this.materials.filter(option => option.name.toLowerCase().includes(filterValue));
  }

  // Para obtener solo el id cuando se guarda el formulario
  get MaterialIdValue(): number | null {
    const material = this.materialForm.get('material_id')!.value;
    return material ? material.id : null;
  }



}
