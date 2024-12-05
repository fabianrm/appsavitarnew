import { Component, OnInit } from '@angular/core';
import { ResumeResponse } from '../Models/ResumeResponse';
import { DashboardService } from '../dashboard.service';

import Chart from 'chart.js/auto';


@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss'
})
export class ResumeComponent implements OnInit {

  resumens: ResumeResponse[] = [];

  constructor(private dashboardService: DashboardService) { }

  chart?: Chart;

  ngOnInit(): void {
    this.getResumens();
  }


  getResumens() {
    this.dashboardService.getResumen().subscribe(resumens => {

      const labels = resumens.data[0].month;
      const data = {
        labels: labels,
        datasets: [{
          label: 'Historial de Ingresos',
          data: resumens.data[0].total_amount,
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
        }]
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
      // console.log(resumens.data[0].total_amount,);
    });
  }

}
