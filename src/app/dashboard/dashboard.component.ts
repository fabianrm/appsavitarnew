import { Component, OnInit, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { DashboardService } from './dashboard.service';
import { Summary } from './Models/SummaryResponse';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  constructor(private dashboardService: DashboardService) { }

  summary?: Summary;

  ngOnInit(): void {

    this.getSummary();

  }


  getSummary() {
    this.dashboardService.getSummary().subscribe(respuesta => {
      this.summary = respuesta.data;
      console.log(respuesta);
    });
  }

}
