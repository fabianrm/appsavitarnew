import { Component, inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Enterprise } from '../Models';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { EnterpriseService } from '../enterprise.service';

@Component({
    selector: 'app-enterprise-list',
    templateUrl: './enterprise-list.component.html',
    styleUrl: './enterprise-list.component.scss',
    standalone: false
})
export class EnterpriseListComponent {

    displayedColumns: string[] = ['id', 'ruc', 'name', 'city', 'address', 'phone', 'status', 'acciones'];
    public dataSource!: MatTableDataSource<Enterprise>;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    subscription!: Subscription

    public respuesta: Enterprise[] = [];

    private router = inject(Router);
    private enterpriseService = inject(EnterpriseService);

    ngOnInit() {
        this.getEnterprises();
        this.subscription = this.enterpriseService.refresh$.subscribe(() => {
            this.getEnterprises()
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }


    getEnterprises() {
        this.enterpriseService.getEnterprises().subscribe((respuesta) => {
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

    newEnterprise() {
        this.router.navigate(['/dashboard/enterprise/enterprise-new']); // Navega al componente "contrato"
    }

    editEnterprise(id: number) {
        this.router.navigate(['/dashboard/enterprise/edit/' + id]); // Navega al componente "contrato"
    }



}
