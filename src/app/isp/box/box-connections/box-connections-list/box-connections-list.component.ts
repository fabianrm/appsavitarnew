import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BoxRouteService } from '../../box-route.service';
import { Box } from '../../Models/BoxResponse';
import { BoxRoute } from '../../Models/BoxRouteResponse';

export interface BoxConnectionsListData {
  boxes: Box[];
}

@Component({
  selector: 'app-box-connections-list',
  templateUrl: './box-connections-list.component.html',
  styleUrls: ['./box-connections-list.component.scss'],
  standalone: false
})
export class BoxConnectionsListComponent implements OnInit {
  routes: BoxRoute[] = [];
  filteredRoutes: BoxRoute[] = [];
  searchTerm: string = '';
  boxesMap: Map<number, Box> = new Map();

  constructor(
    public dialogRef: MatDialogRef<BoxConnectionsListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BoxConnectionsListData,
    private routeService: BoxRouteService
  ) {}

  ngOnInit(): void {
    // Index boxes for faster lookup
    if (this.data.boxes) {
      this.data.boxes.forEach(b => this.boxesMap.set(b.id, b));
    }
    this.loadRoutes();
  }

  loadRoutes() {
    this.routeService.getRoutes().subscribe(res => {
      this.routes = res.data;
      this.filterRoutes();
    });
  }

  getBoxName(id: number): string {
    const box = this.boxesMap.get(id);
    return box ? box.name : `ID: ${id}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue.trim().toLowerCase();
    this.filterRoutes();
  }

  filterRoutes() {
    if (!this.searchTerm) {
      this.filteredRoutes = this.routes;
      return;
    }

    this.filteredRoutes = this.routes.filter(route => {
      const startName = this.getBoxName(route.start_box_id).toLowerCase();
      const endName = this.getBoxName(route.end_box_id).toLowerCase();
      return startName.includes(this.searchTerm) || endName.includes(this.searchTerm);
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
