import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AppointmentEvent} from '../calendar.component';

export interface AppointmentInfo {
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
  appointmentData: AppointmentInfo = {
    reason: '',
    date: new Date(),
    starttime: '00:00:00',
    endtime: '00:00:00',
    animalname: ''
  };

  constructor(
      public dialogRef: MatDialogRef<CalendarDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: AppointmentInfo
  ) {
   /* const year = data.start.getFullYear();
    const month = data.start.getMonth() + 1;
    const day = data.start.getDate();
    console.log('In constructor');
    this.appointmentData = {
        reason: data.title,
        date: new Date(year, month, day),
        starttime: this.getStringTimeFromDate(data.start),
        endtime: this.getStringTimeFromDate(data.end),
        animalname: data.animal
      };*/
     /* this.appointmentData.reason = data.title;

      this.appointmentData.date = new Date(year, month, day);
      this.appointmentData.starttime = this.getStringTimeFromDate(data.start);
      this.appointmentData.endtime = this.getStringTimeFromDate(data.end);
      this.appointmentData.animalname = data.animal;*/
  }

  closeDialog(){
    this.dialogRef.close();
  }

  getStringTimeFromDate(date: Date): string{
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }
}
