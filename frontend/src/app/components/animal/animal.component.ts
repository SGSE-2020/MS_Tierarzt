import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {AnimalDialogComponent} from './animal-dialog/animal-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {GlobalConstantService} from '../../services/global-constants.service';
import {IVetUserDataItem} from '../vetuser/vetuser.component';

export interface IAnimalDataItem {
  uid: string;
  animalid: string;
  animalname: string;
  animaltype: string;
  animalrace: string;
  animalheight: number;
  animalweight: number;
}

@Component({
  selector: 'app-animal',
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.css']
})

export class AnimalComponent implements OnInit, AfterViewInit {
  public animaldataItems: IAnimalDataItem[] = [];
  name: string;
  type: string;
  race: string;
  height: number;
  weight: number;

  displayedColumns: string[] = ['name', 'type', 'race', 'height', 'weight'];
  dataSource = new MatTableDataSource<IAnimalDataItem>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private httpClient: HttpClient,
              public dialog: MatDialog,
              public constants: GlobalConstantService
  ) {
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.loadAnimalData().then();
  }

  ngAfterViewInit(): void {
    this.loadAnimalData().then();
  }

  async loadAnimalData() {
    if (this.constants.isEmployee) {
      this.animaldataItems = await this.httpClient.get<IAnimalDataItem[]>('/api/animal').toPromise();
    } else {
      this.animaldataItems = await this.httpClient.get<IAnimalDataItem[]>('/api/vetuser/' +
        this.constants.firebaseUser.uid + '/animal').toPromise();
    }
    this.dataSource.data = this.animaldataItems;
    this.dataSource.paginator = this.paginator;
  }

  async openAnimalDialog($animalData: IAnimalDataItem, isCreate: boolean){
    const dialogRef = this.dialog.open(AnimalDialogComponent, {
      width: '360px',
      data: $animalData
    });
    dialogRef.componentInstance.isCreateDialog = isCreate;
    dialogRef.componentInstance.isEditable = true;
    if (this.constants.isEmployee) {
      const vetUser = await this.httpClient.get<IVetUserDataItem[]>('/api/vetuser').toPromise();
      dialogRef.componentInstance.users = vetUser;
    }
    dialogRef.afterClosed().subscribe(() => {
      this.loadAnimalData().then();
    });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.animal = result;
    // });
  }
}
