import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {GlobalConstantService} from '../../../services/global-constants.service';

export interface AppointmentInfo {
  appointmentid: string;
  uid: string;
  doctorid: string;
  reason: string;
  date: Date;
  starttime: string;
  endtime: string;
  animalname: string;
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
      messagetitle: 'Termin gelöscht!',
      messagetext: 'Ihre Termin für den ' + this.data.starttime.split(' ', 2)[0] +
        ' wurde erfolgreich abgesagt.\n'
    }).toPromise();
    this.dialogRef.close();
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
