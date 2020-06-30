import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {GlobalConstantService} from '../../../services/global-constants.service';
import {PaymentInfo} from '../administration.component';

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
    await this.httpClient.post('/api/bank', this.data).toPromise();
    this.dialogRef.close();
  }

  closeDialog(){
    this.dialogRef.close();
  }

}
