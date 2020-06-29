import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {VetuserDialogComponent} from './vetuser-dialog/vetuser-dialog.component';
import {MatDialog} from '@angular/material/dialog';

export interface IVetUserDataItem {
  uid: string;
  gender: number;
  firstName: string;
  lastName: string;
  isEmployee: boolean;
  dept: number;
}

export interface Gender {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-vetuser',
  templateUrl: './vetuser.component.html',
  styleUrls: ['./vetuser.component.css']
})
export class VetuserComponent implements OnInit, AfterViewInit {
  public genders: Gender[] = [
    {value: 0, viewValue: 'Divers'},
    {value: 1, viewValue: 'Männlich'},
    {value: 2, viewValue: 'Weiblich'}
  ];

  public vetUserdataItems: IVetUserDataItem[] = [];

  displayedColumns: string[] = ['firstname', 'lastname', 'gender', 'isEmployee'];
  dataSource = new MatTableDataSource<IVetUserDataItem>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private httpClient: HttpClient,
              public dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.loadVetUserData().then();
  }

  ngAfterViewInit(): void {
    this.loadVetUserData().then();
  }

  async loadVetUserData() {
    this.vetUserdataItems = await this.httpClient.get<IVetUserDataItem[]>('/api/vetuser').toPromise();
    this.dataSource = new MatTableDataSource<IVetUserDataItem>(this.vetUserdataItems);
    this.dataSource.paginator = this.paginator;
  }

  openVetUserDialog($vetuserData: IVetUserDataItem, isCreate: boolean): void {
    const dialogRef = this.dialog.open(VetuserDialogComponent, {
      width: '360px',
      data: $vetuserData
    });
    dialogRef.componentInstance.isCreateDialog = isCreate;

    dialogRef.afterClosed().subscribe(() => {
      this.loadVetUserData().then();
    });
  }
}
