import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EntryDetail } from '../../entry/models/EntryDetailResponse';
import { EntryService } from '../../entry/entry.service';
import { MaterialService } from '../../material/material.service';
import { MaterialStock } from '../../material/models/MaterialResponse';
import { MatDialogRef } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-entry-select-dialog',
  templateUrl: './entry-select-dialog.component.html',
  styleUrl: './entry-select-dialog.component.scss'
})
export class EntrySelectDialogComponent {

  displayedColumns: string[] = ['id', 'code', 'material', 'prefix', 'total_stock', 'acciones'];
  public dataSource!: MatTableDataSource<EntryDetail>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription
  public respuesta: EntryDetail[] = [];

  @Output() addMaterial = new EventEmitter<any>();

  constructor(private entryService: EntryService,
    private router: Router,
    private materialService: MaterialService,
    public dialogRef: MatDialogRef<EntrySelectDialogComponent>) { }

  ngOnInit() {
    this.getMaterials();
    this.subscription = this.entryService.refresh$.subscribe(() => {
      this.getMaterials()
    });

  }


  // getEntryDetails() {
  //   this.entryService.getEntryDetails().subscribe((respuesta) => {
  //     if (respuesta.data.length > 0) {
  //       this.dataSource = new MatTableDataSource(respuesta.data);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;

  //       // Configuración del filtro personalizado
  //       this.dataSource.filterPredicate = (data: EntryDetail, filter: string) => {
  //         const transformedFilter = filter.trim().toLowerCase();

  //         // Aquí puedes definir las propiedades que deseas que se incluyan en la búsqueda
  //         return data.material.name.toLowerCase().includes(transformedFilter)
  //           || data.material.code.toLowerCase().includes(transformedFilter)
  //           || data.material.presentation.name.toLowerCase().includes(transformedFilter);
  //       };
  //     }
  //   });
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addMaterialToParent(row: EntryDetail): void {
   
    this.addMaterial.emit(row);
    row.total_stock = row.total_stock - 1
    this.dataSource._updateChangeSubscription();
    
  }


  getMaterials() {
    this.materialService.getStockMaterials().subscribe((respuesta) => {

      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data.filter((x: { total_stock: number; })=> x.total_stock > 0));

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }


  close() {
    this.dialogRef.close();
  }


}
