import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractService } from '../contract.service';
import { Service } from '../Models/ServiceResponse';

@Component({
  selector: 'app-contract-detail',
  templateUrl: './contract-detail.component.html',
  styleUrl: './contract-detail.component.scss'
})
export class ContractDetailComponent implements OnInit, AfterViewInit {
  id!: number;
  contract?: Service;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private contractService: ContractService) { }
  
  ngAfterViewInit(): void {
   

  }

  ngOnInit() {
    this.getCustomerById();
  }

  


  //Obtener customer por id
  getCustomerById() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.id = +idParam; // Usa el símbolo "+" para convertir a número
        this.fetchContractDetails(this.id); // Llama a la función para obtener los detalles del box
      } else {
        // Manejar el caso cuando idParam es null, asignando un valor por defecto o manejando el error
        console.error('ID parameter is null');
      }
    });
  }

  fetchContractDetails(id: number) {
    this.contractService.getServiceByID(id).subscribe((respuesta) => {
    
      if (respuesta) {
        this.contract = respuesta.data;
        //console.log(respuesta.data)
      }
      
    });
  }

}
