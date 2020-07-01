import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {GlobalConstantService} from '../../../services/global-constants.service';
import {PaymentInfo} from '../administration.component';
import {IVetUserDataItem} from '../../vetuser/vetuser.component';

interface TransferMessage {
  status: string;
  userid: string;
  lastname: string;
  message: string;
}

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.css']
})
export class PaymentDialogComponent {

  constructor(public dialogRef: MatDialogRef<PaymentDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: PaymentInfo,
              private httpClient: HttpClient,
              public constants: GlobalConstantService){
  }

  async payDept() {
    console.log(JSON.stringify(this.data));

    const transferMessage = await this.httpClient.post<TransferMessage>('/api/bank', {
      userid: this.data.uid,
      iban: this.data.iban,
      destiban: this.data.destiban,
      purpose: this.data.purpose,
      amount: this.data.dept,
    }).toPromise();
    this.dialogRef.close();

    console.log(JSON.stringify(transferMessage));

    if (transferMessage.status === '200'){
      const currentuserdata = await this.httpClient.get<IVetUserDataItem>('/api/vetuser/' + this.data.uid).toPromise();
      await this.httpClient.put('/api/vetuser/' + this.data.uid, {
        gender: currentuserdata.gender,
        firstName: currentuserdata.firstName,
        lastName: currentuserdata.lastName,
        isEmployee: currentuserdata.isEmployee,
        dept: 0
      }).toPromise();
    }
  }

  closeDialog(){
    this.dialogRef.close();
  }

}
