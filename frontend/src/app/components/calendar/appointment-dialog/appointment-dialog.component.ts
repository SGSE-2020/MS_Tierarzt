import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AppointmentRequest} from '../calendar.component';
import {MessageData} from '../../messages/messages.component';
import {HttpClient} from '@angular/common/http';
import {GlobalConstantService} from '../../../services/global-constants.service';
import {IVetUserDataItem} from '../../vetuser/vetuser.component';
import {MatDialog} from '@angular/material/dialog';
import {AnimalDialogComponent} from '../../animal/animal-dialog/animal-dialog.component';
import {VetuserDialogComponent} from '../../vetuser/vetuser-dialog/vetuser-dialog.component';

@Component({
  selector: 'app-appointment-dialog',
  templateUrl: './appointment-dialog.component.html',
  styleUrls: ['./appointment-dialog.component.css']
})
export class AppointmentDialogComponent implements OnInit {
  starttime: string;
  endtime: string;
  cost: number;

  constructor(private httpClient: HttpClient,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<AppointmentDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: AppointmentRequest,
              public constants: GlobalConstantService) { }

  ngOnInit(): void {
  }

  async cancelRequest(){
    await this.httpClient.delete('/api/appointmentrequest/' + this.data.requestid).toPromise();
    await this.httpClient.post('/api/message', {
      uid: this.data.uid,
      creationtime: new Date(),
      messagetitle: 'Terminanfrage abgelehnt!',
      messagetext: 'Ihre Anfrage für den ' + this.data.start.split(' ', 2)[0] +
        ' wurde abgelehnt.\n' +
        'Bitte versuchen Sie es an einem anderem Tag.'
    }).toPromise();
    this.dialogRef.close();
  }

  async addAppointment(){
    const startdate = this.getStringFromDateString(this.data.start, this.starttime);
    const enddate = this.getStringFromDateString(this.data.start, this.starttime);
    await this.httpClient.delete('/api/appointmentrequest/' + this.data.requestid).toPromise();
    await this.httpClient.post('/api/appointment', {
      uid: this.data.uid,
      reason: this.data.reason,
      start: startdate,
      end: enddate,
      animalid: this.data.animalid,
      cost: this.cost
    }).toPromise();

    const currentuserdata = await this.httpClient.get<IVetUserDataItem>('/api/vetuser/' + this.data.uid).toPromise();

    await this.httpClient.put('/api/vetuser/' + this.data.uid, {
      dept: currentuserdata.dept + this.cost,
      gender: currentuserdata.gender,
      firstName: currentuserdata.firstName,
      lastName: currentuserdata.lastName,
      isEmployee: currentuserdata.isEmployee
    }).toPromise();
    await this.httpClient.post('/api/message', {
      uid: this.data.uid,
      creationtime: new Date(),
      messagetitle: 'Terminanfrage angenommen!',
      messagetext: 'Ihre Anfrage für den ' + this.data.start.split(' ', 2)[0] +
        ' wurde für den Zeitraum von ' + this.starttime + ' bis ' +
        this.endtime + ' festgelegt.\n' +
        'Die Kosten werden sich vorraussichtlich auf ' + this.cost + '€ belaufen.'
    }).toPromise();
    this.dialogRef.close();
  }

  getStringFromDateString(date: string, time: string): string {
    const datestring = date.split(' ')[0];

    const hours = Number(time.split(':')[0]);
    const minutes = Number(time.split(':')[1]);

    let resultstring = datestring + ' ';
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

  async openAnimalDialog($animalid: string){
    const animalData = await this.httpClient.get<IVetUserDataItem>('/api/animal/' + $animalid).toPromise();

    const dialogRef = this.dialog.open(AnimalDialogComponent, {
      width: '360px',
      data: animalData
    });
    dialogRef.componentInstance.isCreateDialog = false;
  }

  async openVetUserDialog($uid: string){
    const vetuserData = await this.httpClient.get<IVetUserDataItem>('/api/vetuser/' + $uid).toPromise();

    const dialogRef = this.dialog.open(VetuserDialogComponent, {
      width: '360px',
      data: vetuserData
    });
    dialogRef.componentInstance.isCreateDialog = false;
  }
}
