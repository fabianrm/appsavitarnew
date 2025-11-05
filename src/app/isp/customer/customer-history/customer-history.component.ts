import { Component, inject, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { ActivatedRoute } from '@angular/router';
import { Historical } from '../Models/Historical';

@Component({
  selector: 'app-customer-history',
  standalone: false,
  templateUrl: './customer-history.component.html',
  styleUrl: './customer-history.component.scss'
})
export class CustomerHistoryComponent implements OnInit {

  private customerService = inject(CustomerService);
  private route = inject(ActivatedRoute)

  id!: number;
  dataCustomerHistory?: Historical;

  ngOnInit(): void {
    this.getCustomerById(); // Example customer ID
  }


  //Obtener customer por id
  getCustomerById() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.id = +idParam; // Usa el símbolo "+" para convertir a número
        this.getCustomerHistory(this.id); // Llama a la función para obtener los detalles del cliente
      } else {
        // Manejar el caso cuando idParam es null, asignando un valor por defecto o manejando el error
        console.error('ID parameter is null');
      }
    });
  }

  getCustomerHistory(customerId: number) {
    return this.customerService.getHistory(customerId).subscribe({
      next: (data) => {
        this.dataCustomerHistory = data;
        console.log('Customer History:', data);
      },
      error: (error) => {
        console.error('Error fetching customer history:', error);
      }
    });
  }



}
