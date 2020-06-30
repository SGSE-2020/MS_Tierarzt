import { Component } from '@angular/core';
import {GlobalConstantService} from '../../services/global-constants.service';
import {PaymentDialogComponent} from './payment-dialog/payment-dialog.component';
import {IVetUserDataItem} from '../vetuser/vetuser.component';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material/dialog';

export interface PaymentInfo{
  uid: string;
  iban: string;
  destiban: string;
  purpose: string;
  dept: number;
}

export interface Account{
  user_id: string;
  iban: string;
}

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent{

  public paymentInfo: PaymentInfo;
  constructor(private httpClient: HttpClient,
              public dialog: MatDialog,
              public constants: GlobalConstantService) { }

  async openPayDialog(){
    const vetuser = await this.httpClient.get<IVetUserDataItem>('/api/vetuser/' + this.constants.firebaseUser.uid).toPromise();
    const account = await this.httpClient.get<Account>('/api/bank/' + this.constants.firebaseUser.uid
      + '/iban').toPromise();

    this.paymentInfo = {
      uid: this.constants.firebaseUser.uid,
      iban: account.iban,
      destiban: 'DE 23 1520 0000 6133 1514 20',
      purpose: 'Tierarztkosten  von ' + vetuser.firstName + ' ' + vetuser.lastName,
      dept: vetuser.dept,
    };

    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '360px',
      data: this.paymentInfo
    });
  }
}
