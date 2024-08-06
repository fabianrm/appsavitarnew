import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from '../../supplier/supplier.service';
import { DocumentService } from '../../document/document.service';
import { EntryTypeService } from '../../entry-type/entry-type.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { Router } from '@angular/router';
import { Document } from '../../document/models/DocumentResponse';
import { Supplier } from '../../supplier/models/SupplierResponse';
import { EntryType } from '../../entry-type/models/EntryTypeResponse';
import { EntryDetail } from '../models/EntryRequest';
import { EntryDetail as edr } from '../models/EntryResponse';
import { MatDialog } from '@angular/material/dialog';
import { MaterialSelectDialogComponent } from '../material-select-dialog/material-select-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { Material } from '../../material/models/MaterialResponse';
import { Warehouse } from '../../warehouse/models/WarehouseResponse';
import { MaterialService } from '../../material/material.service';
import { WarehouseService } from '../../warehouse/warehouse.service';
import { EntryService } from '../entry.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-entry-create',
  templateUrl: './entry-create.component.html',
  styleUrl: './entry-create.component.scss'
})
export class EntryCreateComponent {

  entryForm!: FormGroup;
  documents: Document[] =[]
  suppliers: Supplier[] =[]
  entryTypes: EntryType[] = []
  
  dataSource!: MatTableDataSource<any>;
  materials: Material[] = [];
  warehouses: Warehouse[] = [];

  date = new Date();

  displayedColumns: string[] = ['material', 'quantity', 'price', 'subtotal', 'warehouse', 'location', 'action'];

  constructor(
    public fb: FormBuilder,
    private supplierService: SupplierService,
    private documentService: DocumentService,
    private entryTypeService: EntryTypeService,
    private materialService: MaterialService,
    private entryService: EntryService,
    private warehouseService: WarehouseService,
    private snackbarService: SnackbarService,
    private datePipe: DatePipe,
    private router: Router,
    private dialog: MatDialog
  ) { 
    this.entryForm = this.fb.group({
      entry_type_id: ['', Validators.required],
      document_id: ['', Validators.required],
      document_number: ['', Validators.required],
      supplier_id: [1, Validators.required],
      date: [this.datePipe.transform(this.date, "yyyy-MM-dd")], 
      total: [{ value: 0, disabled: true }],
      status: [1],
      entry_details: this.fb.array([])
    });
   // this.entryForm = this.fb.group(formControlsConfig);
    this.dataSource = new MatTableDataSource((this.entryForm.get('entry_details') as FormArray).controls);

   
  }

  ngOnInit() {
    this.initForm();
    this.getDocuments();
    this.getEntryTypes();
    this.getSuppliers();
    this.getWarehouses();
    this.getMaterials();
  }


  initForm() {
    // const formControlsConfig = {
    //   entry_type_id: ['', Validators.required],
    //   document_id: ['', Validators.required],
    //   document_number: ['', Validators.required],
    //   supplier_id: ['', Validators.required],
    //   date: ['', Validators.required],
    //   total: [{ value: 0, disabled: true }],
    //   status: [1],
    //   entry_details: this.fb.array([])
    // }
    // this.entryForm = this.fb.group(formControlsConfig);

    // Object.keys(formControlsConfig).forEach(key => {
    //   if (key === 'document_number' || key === 'serial' || key === 'model') {
    //     this.entryForm.get(key)?.valueChanges.subscribe(value => {
    //       this.entryForm.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
    //     });
    //   }
    // });
  }

  get entryDetails(): FormArray {
    return this.entryForm.get('entry_details') as FormArray;
  }


  //Documentos
  getDocuments() {
    this.documentService.getDocuments().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.documents = respuesta.data
      }
    });
  }


  //Tipo entradas
  getEntryTypes() {
    this.entryTypeService.getEntryTypes().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.entryTypes = respuesta.data
      }
    });
  }

  //Proveedores
  getSuppliers() {
    this.supplierService.getSuppliers().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.suppliers = respuesta.data
      }
    });
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
        console.log(this.warehouses);
        
      }
    });
  }


  addDetail(detail: edr): void {
    const existingDetail = this.entryDetails.controls.find(control => control.value.material.id === detail.material.id);

    if (existingDetail) {
      const newQuantity = existingDetail.get('quantity')!.value + detail.quantity;
      existingDetail.get('quantity')!.setValue(newQuantity);
      existingDetail.get('subtotal')!.setValue(newQuantity * existingDetail.get('price')!.value);
    } else {
      this.entryDetails.push(this.fb.group({
        ...detail,
        material: detail.material,
        warehouse: detail.warehouse
      }));
    }
    this.updateTotal();
    this.dataSource.data = this.entryDetails.controls;
  }

  removeDetail(index: number): void {
    this.entryDetails.removeAt(index);
    this.updateTotal();
    this.dataSource.data = this.entryDetails.controls;
  }

  updateSubtotal(index: number): void {
    const detail = this.entryDetails.at(index);
    const quantity = detail.get('quantity')!.value;
    const price = detail.get('price')!.value;
    detail.get('subtotal')!.setValue(quantity * price);
    this.updateTotal();
  }

  updateTotal(): void {
    const total = this.entryDetails.controls.reduce((acc, control) => {
      return acc + control.get('subtotal')!.value;
    }, 0);
    this.entryForm.get('total')!.setValue(total);
  }

  openMaterialDialog(): void {
    const dialogRef = this.dialog.open(MaterialSelectDialogComponent);
    dialogRef.disableClose = true;
   // dialogRef.autoFocus = true;

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addDetail({
          ...result,
          material: this.materials.find(m => m.id === result.material_id),
          warehouse: this.warehouses.find(w => w.id === result.warehouse_id)
        });
      }
    });
  }
  

  enviarDatos(): void {

    const formData = this.entryForm.value;
    const currentDate = new Date().toISOString().split('T')[0]; // Formato 'year-month-day'

    const dataToSend = {
      ...formData,
      date: currentDate,

    };

  console.log(dataToSend);
  
   

    if (this.entryForm.valid) {
      this.entryService.addEntry(dataToSend).subscribe(respuesta => {
        this.router.navigate(['/dashboard/entry/entries']);
        this.showSuccess();
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
