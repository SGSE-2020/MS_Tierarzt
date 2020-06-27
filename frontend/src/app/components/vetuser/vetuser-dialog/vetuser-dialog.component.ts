import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Gender, IVetUserDataItem, VetuserComponent} from '../vetuser.component';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-vetuser-dialog',
  templateUrl: './vetuser-dialog.component.html',
  styleUrls: ['./vetuser-dialog.component.css']
})
export class VetuserDialogComponent{
  genders: Gender[] = [
    {value: 0, viewValue: 'Divers'},
    {value: 1, viewValue: 'Männlich'},
    {value: 2, viewValue: 'Weiblich'}
  ];
  isCreateDialog: boolean;

  constructor(
    public dialogRef: MatDialogRef<VetuserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IVetUserDataItem,
    private httpClient: HttpClient) {
    if (data.isEmployee == null){
      data.isEmployee = false;
    }
  }

  async addVetUserData() {
    await this.httpClient.post('/api/vetuser', {
      uid: this.data.uid,
      gender: this.data.gender,
      firstname: this.data.firstName,
      lastname: this.data.lastName,
      isEmployee: this.data.isEmployee,
    }).toPromise();
    this.dialogRef.close();
  }

  async saveVetUserData() {
    await this.httpClient.put('/api/vetuser/' + this.data.uid, {
      uid: this.data.uid,
      gender: this.data.gender,
      firstname: this.data.firstName,
      lastname: this.data.lastName,
      isEmployee: this.data.isEmployee,
    }).toPromise();
    this.dialogRef.close();
  }

  async deleteVetUserData(){
    await this.httpClient.delete('/api/vetuser/' + this.data.uid).toPromise();
    this.dialogRef.close();
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
