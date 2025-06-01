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

  isLoading = false;
  isModalOpen: boolean = false; // Controla si el modal está abierto
  selectedImage: string = ''; // Almacena la URL de la imagen seleccionada
  backupImage: string = 'https://images.pexels.com/photos/356079/pexels-photo-356079.jpeg'; //imagen de respaldo

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

  deleteMaterial(id: number) { }


  //Manejar Imagen
  // Método para abrir el modal
  openModal(imageUrl: string): void {
    this.selectedImage = this.API_IMG + imageUrl;
    this.isLoading = false;
    this.isModalOpen = true;
    console.log(this.selectedImage);

  }

  // Método para cerrar el modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Método para manejar la carga de la imagen en el modal
  onModalImageLoad(): void {
    this.isLoading = true;
  }

  // Método para manejar errores de carga de imágenes en el modal
  handleModalImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.backupImage; // Reemplaza la imagen rota por la de respaldo
    this.isLoading = true; // Oculta el spinner
  }

  // Método para manejar la carga de la imagen en las miniaturas
  onImageLoad(file: any): void {
    file.loaded = true; // Marca la imagen como cargada
  }

  // Método para manejar errores de carga de imágenes
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.backupImage; // Reemplaza la imagen rota por la de respaldo
    this.isLoading = true;
  }

}
