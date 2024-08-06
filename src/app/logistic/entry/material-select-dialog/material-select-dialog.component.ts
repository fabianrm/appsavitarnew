import { Component, OnInit } from '@angular/core';
import { Material, MaterialResponse } from '../../material/models/MaterialResponse';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialService } from '../../material/material.service';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { Warehouse } from '../../warehouse/models/WarehouseResponse';

@Component({
  selector: 'app-material-select-dialog',
  templateUrl: './material-select-dialog.component.html',
  styleUrl: './material-select-dialog.component.scss'
})
export class MaterialSelectDialogComponent implements OnInit {

  materialForm: FormGroup;
  materials: Material[] = [];
  warehouses: Warehouse[] = [];
  
  constructor(public dialogRef: MatDialogRef<MaterialSelectDialogComponent>,
    private fb: FormBuilder, private materialService: MaterialService,
    private warehouseService: WarehouseService,) {
    this.materialForm = this.fb.group({
      material_id: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
      subtotal: [{ value: 0, disabled: true }],
      warehouse_id: ['', Validators.required],
      location: ['', Validators.required]
    });

    this.materialForm.get('quantity')!.valueChanges.subscribe(() => this.updateSubtotal());
    this.materialForm.get('price')!.valueChanges.subscribe(() => this.updateSubtotal());
  }

  ngOnInit() {
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
    if (this.materialForm.valid) {
      this.dialogRef.close(this.materialForm.getRawValue());
      
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }



}
