import { Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Promotion } from '../models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { PromotionService } from '../promotion.service';

@Component({
  selector: 'app-promotion-list',
  templateUrl: './promotion-list.component.html',
  styleUrl: './promotion-list.component.scss'
})
export class PromotionListComponent {

  displayedColumns: string[] = ['id', 'nombre', 'plan', 'fecha_inicio', 'fecha_fin', 'precio', 'duracion', 'estado', 'acciones'];
  public dataSource!: MatTableDataSource<Promotion>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  subscription!: Subscription
  public respuesta: Promotion[] = [];

  private router = inject(Router);
  private snackbarService = inject(SnackbarService);
  private promotionService = inject(PromotionService);


  ngOnInit() {
    this.getPromotions();
    this.subscription = this.promotionService.refresh$.subscribe(() => {
      this.getPromotions()
    });
  }

  getPromotions() {
    this.promotionService.getPromotions().subscribe((respuesta) => {
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

  newPromotion() {
    this.router.navigate(['/dashboard/promotion/create']); // Navega al componente "contrato"
  }

  editPromotion(id: number) {
    this.router.navigate(['/dashboard/promotion/edit/' + id]); // Navega al componente "contrato"
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
