import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {GlobalConstantService} from '../../../services/global-constants.service';
import {IVetUserDataItem} from '../../vetuser/vetuser.component';

export interface AppointmentInfo {
  appointmentid: string;
  uid: string;
  doctorid: string;
  reason: string;
  date: Date;
  starttime: string;
  endtime: string;
  animalname: string;
  cost: number;
}

@Component({
  selector: 'app-calendar-dialog',
  templateUrl: './calendar-dialog.component.html',
  styleUrls: ['./calendar-dialog.component.css']
})

export class CalendarDialogComponent {
  isCreateDialog: boolean;

  constructor(
      public dialogRef: MatDialogRef<CalendarDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: AppointmentInfo,
      private httpClient: HttpClient,
      public constants: GlobalConstantService
  ) {

  }

  async cancelAppointment(){
    await this.httpClient.delete('/api/appointment/' + this.data.appointmentid).toPromise();
    await this.httpClient.post('/api/message', {
      uid: this.constants.firebaseUser.uid,
      creationtime: new Date(),
      messagetitle: 'Termin abgesagt!',
      messagetext: 'Ihr Termin für den ' + this.data.starttime.split(' ', 2)[0] +
        ' wurde abgesagt.\n'
    }).toPromise();
    await this.httpClient.post('/api/message', {
      uid: this.constants.firebaseUser.uid,
      creationtime: new Date(),
      messagetitle: 'Behandlung abgesagt!',
      messagetext: 'Ihre Behandlung für den ' + this.data.starttime.split(' ', 2)[0] +
        ' wurde abgesagt.\n'
    }).toPromise();

    const currentuserdata = await this.httpClient.get<IVetUserDataItem>('/api/vetuser/' + this.data.uid).toPromise();

    let dept;
    if (currentuserdata.dept == null || currentuserdata.dept === 0){
      dept = 0;
    }
    else
    {
      dept = currentuserdata.dept - this.data.cost;
    }

    await this.httpClient.put('/api/vetuser/' + this.data.uid, {
      dept,
      gender: currentuserdata.gender,
      firstName: currentuserdata.firstName,
      lastName: currentuserdata.lastName,
      isEmployee: currentuserdata.isEmployee
    }).toPromise();

    this.dialogRef.close();
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
