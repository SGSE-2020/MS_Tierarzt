import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {GlobalConstantService} from '../../../services/global-constants.service';
import {PaymentInfo} from '../administration.component';

interface TransferMessage {
  status: string;
  user_id: string;
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
    const transferMessage = await this.httpClient.post<TransferMessage>('/api/bank', {
      user_id: this.data.uid,
      iban: this.data.iban,
      dest_iban: this.data.destiban,
      purpose: this.data.purpose,
      amount: this.data.dept,
    }).toPromise();
    this.dialogRef.close();

    console.log(JSON.stringify(transferMessage));
  }

  closeDialog(){
    this.dialogRef.close();
  }

}
