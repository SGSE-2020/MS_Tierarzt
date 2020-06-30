import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {IAnimalDataItem} from '../animal.component';
import {HttpClient} from '@angular/common/http';
import {GlobalConstantService} from '../../../services/global-constants.service';

@Component({
  selector: 'app-animal-dialog',
  templateUrl: './animal-dialog.component.html',
  styleUrls: ['./animal-dialog.component.css']
})
export class AnimalDialogComponent {
  isCreateDialog: boolean;
  isEditable: boolean;

  constructor(
    public dialogRef: MatDialogRef<AnimalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IAnimalDataItem,
    private httpClient: HttpClient,
    public constants: GlobalConstantService) {
  }

  async addAnimalData() {
    let uid: string;
    if (this.constants.isEmployee){
      uid = this.data.uid;
    } else {
      uid = this.constants.firebaseUser.uid;
    }
    await this.httpClient.post('/api/animal', {
      uid,
      animalname: this.data.animalname,
      animaltype: this.data.animaltype,
      animalrace: this.data.animalrace,
      animalheight: this.data.animalheight,
      animalweight: this.data.animalweight,
    }).toPromise();
    this.dialogRef.close();
  }

  async saveAnimalData() {
    await this.httpClient.put('/api/animal/' + this.data.animalid, {
      uid: this.data.uid,
      animalname: this.data.animalname,
      animaltype: this.data.animaltype,
      animalrace: this.data.animalrace,
      animalheight: this.data.animalheight,
      animalweight: this.data.animalweight,
    }).toPromise();
    this.dialogRef.close();
  }

  async deleteAnimalData(){
    await this.httpClient.delete('/api/animal/' + this.data.animalid).toPromise();
    this.dialogRef.close();
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
