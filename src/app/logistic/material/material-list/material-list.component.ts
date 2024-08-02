import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialService } from '../material.service';
import { MatTableDataSource } from '@angular/material/table';
import { Material, MaterialResponse } from '../models/MaterialResponse';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-material-list',
  templateUrl: './material-list.component.html',
  styleUrl: './material-list.component.scss'
})
export class MaterialListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'code', 'name', 'category_id', 'presentation_id', 'brand_id', 'serial', 'model', 'min', 'type', 'image', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<Material>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  public respuesta: MaterialResponse[] = [];

  constructor(private materialService: MaterialService, private router: Router,) { }
  
  ngOnInit() {
    this.getMaterials();
    this.subscription = this.materialService.refresh$.subscribe(() => {
      this.getMaterials()
    });
    
  }

  getMaterials() {
    this.materialService.getMaterials().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

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

  newMaterial() {
    this.router.navigateByUrl('/dashboard/material/material-create'); // Navega al componente "contrato"
  }

  editMaterial(id: number) { }
  
  deleteMaterial(id:number) { }

}
