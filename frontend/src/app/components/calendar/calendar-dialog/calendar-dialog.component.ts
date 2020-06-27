import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AppointmentEvent} from '../calendar.component';

interface AppointmentData {
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
  appointmentData: AppointmentData;

  constructor(
    public dialogRef: MatDialogRef<CalendarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppointmentEvent) {
      this.appointmentData.reason = data.title;
  }

  async addAppointmentData() {
    this.dialogRef.close();
  }

  async saveAppointmentData() {
    this.dialogRef.close();
  }

  async deleteAppointmentData(){
    this.dialogRef.close();
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
