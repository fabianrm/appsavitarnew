import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Summary } from './Models/SummaryResponse';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: false
})
export class DashboardComponent implements OnInit {

  constructor(private dashboardService: DashboardService) { }

  cards = [
    { icon: 'group', number: 0, label: 'Clientes Activos' },
    { icon: 'trending_up', number: '0', label: 'Servicios Activos' },
    { icon: 'attach_money', number: '0', label: 'Planes Activos' },
    { icon: 'report_problem', number: '0', label: 'Facturas Vencidas' },
    { icon: 'local_atm', number: '0', label: 'Pagos del día' },
    { icon: 'payments', number: '0', label: 'Pagos del mes' },
    { icon: 'event_busy', number: '0', label: 'Pagos Vencidos' }
  ];

  cardsTotals = [
    { icon: 'local_atm', number: '0', label: 'Pagos del día' },
    { icon: 'payments', number: '0', label: 'Pagos del mes' },
    { icon: 'event_busy', number: '0', label: 'Pagos Vencidos' }
  ];

  cardsTotalsExpenses = [
    { icon: 'local_atm', number: '0', label: 'Gastos del día' },
    { icon: 'payments', number: '0', label: 'Gastos del mes' },
  ];


  summary?: Summary;

  ngOnInit(): void {
    this.getSummary();
  }

  get User() {
    return localStorage.getItem('user_name');
  }


  getSummary() {
    this.dashboardService.getSummary().subscribe(respuesta => {
      this.summary = respuesta.data
      this.cards = [
        { icon: 'group', number: this.summary.activeCustomers, label: 'Clientes Activos' },
        { icon: 'wifi', number: this.summary.activePlans, label: 'Planes Activos' },
        { icon: 'attach_money', number: this.summary.pendingInvoices, label: 'Facturas Pendientes' },
        { icon: 'report_problem', number: this.summary.overdueInvoices, label: 'Facturas Vencidas' },
      ];
      this.getSummaryAmounts();
      this.getExpensesSummary();
    });
  }


  getSummaryAmounts() {
    this.cardsTotals = [
      { icon: 'local_atm', number: this.formatCurrency(this.summary!.paidDaySum), label: 'Hoy ' + this.summary?.totalPaidDay + ' Pagos' },
      { icon: 'payments', number: this.formatCurrency(this.summary!.paidMonthSum), label: 'Pagos del Mes' },
      { icon: 'event_busy', number: this.formatCurrency(this.summary!.overduePaidSum), label: 'Pagos Vencidos' },
    ];
  }

  getExpensesSummary() {
    this.cardsTotalsExpenses = [
      { icon: 'local_atm', number: this.formatCurrency(this.summary!.expenseDaySum), label: 'Gastos del Día' },
      { icon: 'payments', number: this.formatCurrency(this.summary!.expenseMonthSum), label: 'Gastos del Mes' },
      { icon: 'payments', number: this.formatCurrency(this.summary!.paidMonthSum - this.summary!.expenseMonthSum), label: 'Total' },
    ];
  }


  formatCurrency(value: number = 0): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(value);
  }

}
