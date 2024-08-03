import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from '../../supplier/supplier.service';
import { DocumentService } from '../../document/document.service';
import { EntryTypeService } from '../../entry-type/entry-type.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { Router } from '@angular/router';
import { Document } from '../../document/models/DocumentResponse';
import { Supplier } from '../../supplier/models/SupplierResponse';
import { EntryType } from '../../entry-type/models/EntryTypeResponse';

@Component({
  selector: 'app-entry-create',
  templateUrl: './entry-create.component.html',
  styleUrl: './entry-create.component.scss'
})
export class EntryCreateComponent {

  formEntry!: FormGroup;
  documents: Document[] =[]
  suppliers: Supplier[] =[]
  entryTypes: EntryType[] =[]

  constructor(
    public formulario: FormBuilder,
    private supplierService: SupplierService,
    private documentService: DocumentService,
    private entryTypeService: EntryTypeService,
    private snackbarService: SnackbarService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initForm();
    this.getDocuments();
    this.getEntryTypes();
    this.getSuppliers();
  }


  initForm() {
    const formControlsConfig = {
      entry_type_id: ['', Validators.required],
      document_id: ['', Validators.required],
      document_number: ['', Validators.required],
      supplier_id: ['', Validators.required],
    
      status: [1],
    }
    this.formEntry = this.formulario.group(formControlsConfig);

    Object.keys(formControlsConfig).forEach(key => {
      if (key === 'document_number' || key === 'serial' || key === 'model') {
        this.formEntry.get(key)?.valueChanges.subscribe(value => {
          this.formEntry.get(key)?.setValue(value.toUpperCase(), { emitEvent: false });
        });
      }
    });
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

  enviarDatos():void {}

}
