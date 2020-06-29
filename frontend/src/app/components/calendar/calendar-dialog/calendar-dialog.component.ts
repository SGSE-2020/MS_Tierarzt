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

  constructor(
      public dialogRef: MatDialogRef<CalendarDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: AppointmentInfo
  ) {

  }

  closeDialog(){
    this.dialogRef.close();
  }
}
