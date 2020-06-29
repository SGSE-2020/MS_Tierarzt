import {Component, Inject, OnInit} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MessageData} from '../messages.component';
import {HttpClient} from '@angular/common/http';
import {GlobalConstantService} from '../../../services/global-constants.service';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent implements OnInit{

  constructor(private httpClient: HttpClient,
              public dialogRef: MatDialogRef<MessageDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: MessageData,
              public constants: GlobalConstantService) { }


  async ngOnInit() {
    console.log(JSON.stringify(this.data));
    if (!this.data.read) {
      await this.httpClient.put<MessageData>('/api/message/' + this.data.mid,
        {
          uid: this.data.uid,
          messagetitle: this.data.messagetitle,
          messagetext: this.data.messagetext,
          creationtime: this.data.creationtime,
          read: true
        }).toPromise();
    }
  }

  closeDialog(){
    this.dialogRef.close();
  }

  async deleteMessage(){
    await this.httpClient.delete('/api/message/' + this.data.mid).toPromise();
    this.dialogRef.close();
  }
}
