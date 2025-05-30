import { Component, OnInit } from '@angular/core';
import { Resume } from '../Models/ResumeResponse';
import { DashboardService } from '../dashboard.service';

import Chart from 'chart.js/auto';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss',
  standalone: false
})
export class ResumeComponent implements OnInit {

  resumens: Resume[] = [];
  resumeExpenses: Resume[] = [];

  constructor(private dashboardService: DashboardService) { }

  chart?: Chart;

  ngOnInit(): void {
    forkJoin({
      ingresos: this.dashboardService.getResumen(),
      egresos: this.dashboardService.getResumenExpense()
    }).subscribe(({ ingresos, egresos }) => {
      this.resumens = ingresos.data;
      this.resumeExpenses = egresos.data;
      this.buildChart();
    });
  }


  buildChart() {
    const labels = this.resumens[0].month;
    const data = {
      labels: labels,
      datasets: [{
        label: 'Historial de Ingresos',
        data: this.resumens[0].total_amount,
        fill: true,
        tension: 0.1,
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(255, 205, 86)',
          'rgb(255, 159, 64)',
          'rgb(255, 99, 132)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1,
        barPercentage: .5,
      },
      {
        label: 'Historial de Egresos',
        data: this.resumeExpenses[0].total_amount,
        fill: true,
        tension: 0.1,
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1,
        barPercentage: .5,
      },
      ]
    };

    this.chart = new Chart("chart", {
      type: 'line',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });

  }

}
