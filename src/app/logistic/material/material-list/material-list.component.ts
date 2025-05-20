import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialService } from '../material.service';
import { MatTableDataSource } from '@angular/material/table';
import { Material } from '../models/MaterialResponse';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-material-list',
    templateUrl: './material-list.component.html',
    styleUrl: './material-list.component.scss',
    standalone: false
})
export class MaterialListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'code', 'name', 'category_id', 'presentation_id', 'brand_id', 'min', 'type', 'image', 'status', 'acciones'];
  public dataSource!: MatTableDataSource<Material>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription

  API_IMG: string = environment.servidor_img;

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
        console.log(respuesta.data);
       
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

  editMaterial(id: number) {
    this.router.navigate(['/dashboard/material/material-edit/' + id]); // Navega al componente "contrato"
  }
  
  viewImage(row: Material) {
    this.router.navigateByUrl(this.API_IMG + row.image)
  }
  
  deleteMaterial(id:number) { }

}
