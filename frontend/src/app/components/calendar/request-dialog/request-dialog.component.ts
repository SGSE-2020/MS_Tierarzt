import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AppointmentRequest} from '../calendar.component';
import {HttpClient} from '@angular/common/http';
import {GlobalConstantService} from '../../../services/global-constants.service';
import {IAnimalDataItem} from '../../animal/animal.component';


@Component({
  selector: 'app-request-dialog',
  templateUrl: './request-dialog.component.html',
  styleUrls: ['./request-dialog.component.css']
})
export class RequestDialogComponent{
  date: Date;
  starttime: string;
  endtime: string;
  animalid: string;
  reason: string;

  constructor(
    public dialogRef: MatDialogRef<RequestDialogComponent>,
    private httpClient: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: IAnimalDataItem[],
    public constants: GlobalConstantService) {
  }

  async addRequest() {
    let uid: string;
    console.log(this.date.toLocaleString());
    console.log(this.starttime);
    const startdate = this.createDateStringFromDateTime(this.date, this.starttime);
    const enddate = this.createDateStringFromDateTime(this.date, this.endtime);
    uid = this.constants.firebaseUser.uid;
    // TODO remove when pushing
    // uid = '6TbzcPavrSNdq1W1qAKqyfhhvxB2';
    await this.httpClient.post<AppointmentRequest>('/api/appointmentrequest', {
      uid,
      reason: this.reason,
      animalid: this.animalid,
      start: startdate,
      end: enddate,
    }).toPromise();
    this.dialogRef.close();
  }

  createDateStringFromDateTime(date: Date, time: string): string{
    const datestring = date.toLocaleString();
    const year = Number(datestring.split('-', 3)[0]);
    const month = Number(datestring.split('-', 3)[1]);
    const day = Number(datestring.split('-', 3)[2]);
    const hours = Number(time.split(':', 2)[0]);
    const minutes = Number(time.split(':', 2)[1]);

    let resultstring = year + '-';
    if (month < 10) {
      resultstring = resultstring + '0' + month + '-';
    }
    else {
      resultstring = resultstring + month + '-';
    }
    if (day < 10) {
      resultstring = resultstring + '0' + day + ' ';
    }
    else {
      resultstring = resultstring + day + ' ';
    }
    if (hours < 10) {
      resultstring = resultstring + '0' + hours + ':';
    }
    else {
      resultstring = resultstring + hours + ':';
    }
    if (minutes < 10) {
      resultstring = resultstring + '0' + minutes + ':00';
    }
    else {
      resultstring = resultstring + minutes + ':00';
    }

    return resultstring;
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
