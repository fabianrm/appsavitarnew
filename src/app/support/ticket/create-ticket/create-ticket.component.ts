import { Component, OnInit } from '@angular/core';
import { CategoryTicketService } from '../../category-ticket/categoryTicket.service';
import { CategoryTicket } from '../../category-ticket/Models/CategoryTicketResponse';
import { Customer } from '../../../isp/customer/Models/CustomerResponse';
import { map, Observable, startWith } from 'rxjs';
import { CustomerService } from '../../../isp/customer/customer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketService } from '../ticket.service';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { DestinationService } from '../../../logistic/destination/destination.service';
import { Destination } from '../../../logistic/destination/models/DestinationResponse';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.scss',
  standalone: false
})
export class CreateTicketComponent implements OnInit {

  constructor(
    public formulario: FormBuilder,
    private ticketService: TicketService,
    private categoryTicket: CategoryTicketService,
    private customerService: CustomerService,
    private destinationService: DestinationService,
    private router: Router,
    private snackbarService: SnackbarService
  ) { }

  categoryTickets: CategoryTicket[] = [];
  customers: Customer[] = [];
  destinations: Destination[] = []

  filteredCustomer!: Observable<Customer[]>;
  selectedCustomer!: Customer | null;
  selectedFile: File | null = null;
  filename: string = '';

  formTicket!: FormGroup;


  ngOnInit(): void {
    this.getCategories();
    this.getCustomers();
    this.getDestinations();
    this.initForm();
  }

  initForm() {
    const formControlsConfig = {
      category_ticket_id: ['', Validators.required],
      destination_id: ['', Validators.required],
      subject: ['', Validators.required],
      description: ['', Validators.required],
      customer_id: ['', Validators.required],
      priority: ['', Validators.required],
      admin_id: [this.UserID,],
      status: ['Pendiente'],

    }
    this.formTicket = this.formulario.group(formControlsConfig);

    //Subscribirse a los cambios del combo box
    this.formTicket.get('customer_id')!.valueChanges.subscribe(value => {
      this.selectedCustomer = typeof value === 'object' ? value : null;
    });


    //Filtrar combo por name 
    this.filteredCustomer = this.formTicket.get('customer_id')!.valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value?.name)),
      map(name => (name ? this._filterCustomer(name) : this.customers.slice()))
    );
  }


  private _filterCustomer(name: string): Customer[] {
    const filterValue = name.toLowerCase();
    return this.customers.filter(option => option.customerName.toLowerCase().includes(filterValue));
  }

  //Datos a mostrar en el combo
  displayFn(customer: Customer): string {
    return customer && customer.customerName ? customer.customerName : '';
  }

  // Para obtener solo el id cuando se guarda el formulario
  get customerIdValue(): number | null {
    const customer = this.formTicket.get('customer_id')!.value;
    return customer ? customer.id : null;
  }




  //cargar categorías
  getCategories() {
    this.categoryTicket.getCategoryTickets().subscribe((respuesta) => {
      // console.log(respuesta.data)
      if (respuesta.data.length > 0) {
        this.categoryTickets = respuesta.data.filter(x => x.status === 1);
      }
    });
  }

  //Destinations
  getDestinations() {
    this.destinationService.getDestinations().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.destinations = respuesta.data
      }
    });
  }


  //Cargar Clientes
  getCustomers() {
    this.customerService.getCustomers().subscribe((respuesta) => {
      //  console.log(respuesta.data)
      if (respuesta.data.length > 0) {
        this.customers = respuesta.data;
      }
    });
  }

  //Cancelar
  goTickets() {
    this.router.navigate(['/support/tickets/list-tickets']);
  }

  //Ir al Ticket
  showTicket(id: number) {
    this.router.navigate(['/support/tickets/edit-ticket/' + id]); // Navega al componente "detail ticket"
  }

  //Usuario
  get UserID() {
    return localStorage.getItem('id_user');
  }

  //Guardar
  enviarDatos() {
    const formData = this.formTicket.value;
    const customerId = this.customerIdValue;

    const dataToSend = {
      ...formData,
      customer_id: customerId,
    };

    if (this.formTicket.valid) {
      this.ticketService.addTicket(dataToSend).subscribe(respuesta => {
        // console.log(respuesta);
        //this.showTicket(respuesta.id);
        this.goTickets();
        this.showSuccess();
      });
    }

  }

  showError() {
    this.snackbarService.showError('Ocurrio un error al actualizar los datos...');
  }

  showSuccess() {
    this.snackbarService.showSuccess('Los datos se actualizarón correctamente');
  }

}
