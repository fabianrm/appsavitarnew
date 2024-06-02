import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Summary } from './Models/SummaryResponse';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  constructor(private dashboardService: DashboardService) { }

  cards = [
    { icon: 'group', number: 0, label: 'Clientes Activos' },
    { icon: 'trending_up', number: '0', label: 'Servicios Activos' },
    { icon: 'attach_money', number: '0', label: 'Planes Activos' },
    { icon: 'report_problem', number: '0', label: 'Facturas Vencidas' }
  ];

  summary?: Summary;

  ngOnInit(): void {
    this.getSummary();
  }


  getSummary() {
    this.dashboardService.getSummary().subscribe(respuesta => {
      this.summary = respuesta.data
      this.cards = [
        { icon: 'group', number: this.summary.activeCustomers, label: 'Clientes Activos' },
        { icon: 'wifi', number: this.summary.activePlans, label: 'Planes Activos' },
        { icon: 'attach_money', number: this.summary.pendingInvoices, label: 'Facturas Pendientes' },
        { icon: 'report_problem', number: this.summary.overdueInvoices, label: 'Facturas Vencidas' }
      ];
    });
  }


  // getSummary() {
  //   this.dashboardService.getSummary().subscribe(respuesta => {
  //     this.summary = respuesta.data;
  //     console.log(respuesta);
  //   });
  // }

}
