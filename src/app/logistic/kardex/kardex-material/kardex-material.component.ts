import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KardexService } from '../kardex.service';
import { Kardex } from '../models/KardexResponse';

@Component({
  selector: 'app-kardex-material',
  templateUrl: './kardex-material.component.html',
  styleUrl: './kardex-material.component.scss'
})
export class KardexMaterialComponent implements OnInit {

  id: number = 0;
  dataKardex: Kardex[] = [];

  ngOnInit(): void {

    this.getKardexById()
  }

  constructor(private route: ActivatedRoute,
    private kardexService: KardexService,) { }

  //Obtener customer por id
  getKardexById() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.id = +idParam; // Usa el símbolo "+" para convertir a número
        this.fetchKardexDetail(this.id); // Llama a la función para obtener los detalles del cliente
      } else {
        // Manejar el caso cuando idParam es null, asignando un valor por defecto o manejando el error
        console.error('ID parameter is null');
      }
    });
  }

  fetchKardexDetail(id: number) {
    this.kardexService.getKardexByID(id).subscribe((respuesta) => {
      this.dataKardex = respuesta.data;
      console.log(this.dataKardex);
    });
  }


}
