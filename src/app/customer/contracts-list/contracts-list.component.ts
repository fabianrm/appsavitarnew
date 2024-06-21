import { Component, Inject, OnInit } from '@angular/core';
import { ContractService } from './../../contract/contract.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Service } from '../../contract/Models/ServiceResponse';


@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrl: './contracts-list.component.scss'
})
export class ContractsListComponent implements OnInit {

  displayedColumns: string[] = ['serviceCode', 'planName', 'installationDate', 'addressInstallation', 'vlan', 'boxName', 'portNumber','status'];
  public dataSource!: MatTableDataSource<Service>;

  public respuesta!: Service;

  constructor(
    @Inject(MAT_DIALOG_DATA) public getId: number,
    private contractService: ContractService,
    private dialogRef: MatDialogRef<ContractsListComponent>) { }
  
  ngOnInit() {
    console.log(this.getId);
    this.getServiceByCustomer(this.getId)


  }

  getServiceByCustomer(id: number) {
    this.contractService.getServiceByCustomer(id).subscribe((respuesta) => {

      if (respuesta.data.length > 0) {
        this.dataSource = new MatTableDataSource(respuesta.data);
      //  this.dataSource.paginator = this.paginator;
       // this.dataSource.sort = this.sort;
      }

    });

  }


}
