import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from '../ticket.service';
import { CategoryTicketService } from '../../category-ticket/categoryTicket.service';
import { CustomerService } from '../../../isp/customer/customer.service';
import { DestinationService } from '../../../logistic/destination/destination.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackbarService } from '../../../shared/snackbar/snackbar.service';
import { CategoryTicket } from '../../category-ticket/Models/CategoryTicketResponse';
import Swal from 'sweetalert2';
import { Destination } from '../../../logistic/destination/models/DestinationResponse';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { Customer } from '../../../isp/customer/Models/CustomerResponse';
import { Ticket } from '../Models/TicketResponse';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit-ticket',
  templateUrl: './edit-ticket.component.html',
  styleUrl: './edit-ticket.component.scss',
  standalone: false,
})
export class EditTicketComponent implements OnInit {
  constructor(
    public formulario: FormBuilder,
    private ticketService: TicketService,
    private categoryTicket: CategoryTicketService,
    private customerService: CustomerService,
    private destinationService: DestinationService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService,
  ) {}

  SRVIMG: string = environment.servidor_img;
  id!: number;
  categoryTickets: CategoryTicket[] = [];
  customers: Customer[] = [];
  destinations: Destination[] = [];
  dataTicket?: Ticket;

  filteredCustomer!: Observable<Customer[]>;
  selectedCustomer!: Customer | null;
  selectedFile: File | null = null;
  filename: string = '';

  formTicket!: FormGroup;
  subscription!: Subscription;

  ngOnInit(): void {
    this.getCategories();
    this.getCustomers();
    this.getDestinations();

    this.initForm();

    this.getTicketByID();
    this.subscription = this.ticketService.refresh$.subscribe(() => {
      this.getTicketByID();
    });
  }

  initForm() {
    const formControlsConfig = {
      category_ticket_id: [this.dataTicket?.category.id, Validators.required],
      destination_id: ['', Validators.required],
      customer_id: [''],
      subject: [this.dataTicket?.subject, Validators.required],
      description: [this.dataTicket?.description, Validators.required],
      priority: ['', Validators.required],
      admin_id: [this.UserID],
      status: [''],
    };
    this.formTicket = this.formulario.group(formControlsConfig);

    //Subscribirse a los cambios del combo box
    this.formTicket.get('customer_id')!.valueChanges.subscribe((value) => {
      this.selectedCustomer = typeof value === 'object' ? value : null;
    });

    //Filtrar combo por name
    this.filteredCustomer = this.formTicket
      .get('customer_id')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value?.name)),
        map((name) =>
          name ? this._filterCustomer(name) : this.customers.slice(),
        ),
      );
  }

  private _filterCustomer(name: string): Customer[] {
    const filterValue = name.toLowerCase();
    return this.customers.filter((option) =>
      option.customerName.toLowerCase().includes(filterValue),
    );
  }

  //Datos a mostrar en el combo
  displayFn(customer: Customer): string {
    return customer && customer.customerName ? customer.customerName : '';
  }

  // Para obtener solo el id cuando se guarda el formulario
  get customerIdValue(): number | null {
    const customer = this.formTicket.get('customer_id')!.value;
    return customer ? customer.id : this.dataTicket!.customer.id;
  }

  //Obtener customer por id
  getTicketByID() {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.id = +idParam; // Usa el símbolo "+" para convertir a número
        this.fetchTicketDetail(this.id); // Llama a la función para obtener los detalles del cliente
      } else {
        // Manejar el caso cuando idParam es null, asignando un valor por defecto o manejando el error
        console.error('ID parameter is null');
      }
    });
  }

  fetchTicketDetail(id: number) {
    this.ticketService.getTicketByID(id).subscribe((respuesta) => {
      this.dataTicket = respuesta.data;
      this.formTicket.patchValue({
        destination_id: this.dataTicket?.project.id,
        category_ticket_id: this.dataTicket?.category.id,
        description: this.dataTicket?.description,
        subject: this.dataTicket?.subject,
        priority: this.dataTicket?.priority,
        status: this.dataTicket?.status,
      });

      //console.log(this.dataTicket);
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.selectedFile = file;
      this.filename = file.name;
      this.uploadAttachment();
    }
  }

  //Subir adjunto
  uploadAttachment() {
    if (this.selectedFile) {
      this.ticketService
        .addAttachment(this.id, this.selectedFile, this.filename)
        .subscribe(
          (response) => {
            console.log('Attachment uploaded successfully', response);
          },
          (error) => {
            console.error('Error uploading attachment', error);
          },
        );
    }
  }

  //cargar categorías
  getCategories() {
    this.categoryTicket.getCategoryTickets().subscribe((respuesta) => {
      //  console.log(respuesta.data)
      if (respuesta.data.length > 0) {
        this.categoryTickets = respuesta.data;
      }
    });
  }

  //Destinations
  getDestinations() {
    this.destinationService.getDestinations().subscribe((respuesta) => {
      if (respuesta.data.length > 0) {
        this.destinations = respuesta.data;
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
    this.router.navigate(['/support/tickets/detail-ticket/' + id]); // Navega al componente "detail ticket"
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
      this.ticketService
        .updateTicket(this.id, dataToSend)
        .subscribe((respuesta) => {
          this.showSuccess();
          this.goTickets();
        });
    }
  }

  showError() {
    this.snackbarService.showError(
      'Ocurrio un error al actualizar los datos...',
    );
  }

  showSuccess() {
    this.snackbarService.showSuccess('Los datos se actualizarón correctamente');
  }

  // Check if file is an image based on extension
  isImage(filePath: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const extension = filePath
      .toLowerCase()
      .substring(filePath.lastIndexOf('.'));
    return imageExtensions.includes(extension);
  }

  // Get attachment URL
  getAttachmentUrl(attachmentId: number): string {
    return `${this.SRVIMG}apisavitar/api/v1/tickets/attachments/${attachmentId}/view`;
  }

  // Handle image load errors
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    // Prevent infinite loop if fallback also fails
    if (!img.dataset['errorHandled']) {
      img.dataset['errorHandled'] = 'true';
      // Use a simple placeholder or hide the image
      img.style.display = 'none';
      // Optionally, show a placeholder icon instead
      const parent = img.parentElement;
      if (parent) {
        parent.innerHTML =
          '<div style="width: 100px; height: 100px; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 8px; border: 2px solid #ddd;">📷</div>';
      }
    }
  }

  // View attachment in modal
  viewAttachment(attachmentId: number) {
    const imageUrl = this.getAttachmentUrl(attachmentId);

    Swal.fire({
      imageUrl: imageUrl,
      imageAlt: 'Ticket Attachment',
      showCloseButton: true,
      showConfirmButton: false,
      width: '800px',
      padding: '20px',
      customClass: {
        popup: 'swal-attachment-popup',
        image: 'swal-attachment-image',
      },
      didOpen: () => {
        // Adjust for mobile
        const popup = document.querySelector(
          '.swal-attachment-popup',
        ) as HTMLElement;
        if (popup && window.innerWidth < 768) {
          popup.style.width = '95%';
          popup.style.maxWidth = '500px';
        }
      },
    });
  }

  // Delete attachment with confirmation
  deleteAttachment(attachmentId: number, event: Event) {
    event.stopPropagation(); // Prevent triggering parent click events

    Swal.fire({
      title: '¿Eliminar adjunto?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ticketService.deleteAttachment(attachmentId).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'El adjunto ha sido eliminado correctamente',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            });
            // Refresh ticket data
            this.getTicketByID();
          },
          error: (error) => {
            console.error('Error deleting attachment:', error);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el adjunto',
              icon: 'error',
            });
          },
        });
      }
    });
  }
}
