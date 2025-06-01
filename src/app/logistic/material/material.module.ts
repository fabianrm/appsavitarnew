import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialCreateComponent } from './material-create/material-create.component';
import { MaterialEditComponent } from './material-edit/material-edit.component';
import { MaterialListComponent } from './material-list/material-list.component';
import { MaterialRoutingModule } from './material-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardModule, MatCardTitle } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MaterialStockComponent } from './material-stock/material-stock.component';
import { MaterialLocationComponent } from './material-location/material-location.component';



@NgModule({
  declarations: [
    MaterialListComponent,
    MaterialCreateComponent,
    MaterialEditComponent,
    MaterialStockComponent,
    MaterialLocationComponent
  ],
  imports: [
    CommonModule,
    MaterialRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule,
    MatCard,
    MatCardActions,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatIconButton




  ]
})
export class MaterialModule { }
