import { Component, OnInit, AfterViewInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MessageDialogComponent} from './message-dialog/message-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {GlobalConstantService} from '../../services/global-constants.service';

export interface MessageData {
  mid: string;
  uid: string;
  messagetitle: string;
  messagetext: string;
  creationtime: string;
  read: boolean;
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, AfterViewInit {
  messages: MessageData[] = [];

  constructor(private httpClient: HttpClient,
              public dialog: MatDialog,
              public constants: GlobalConstantService) { }

  ngOnInit() {
    this.loadMessageData().then();
  }

  ngAfterViewInit(): void {
    this.loadMessageData().then();
  }

  async loadMessageData() {
    // TODO change this before push
    const uid = this.constants.firebaseUser.uid;
    // const uid = '6TbzcPavrSNdq1W1qAKqyfhhvxB2';
    this.messages = await this.httpClient.get<MessageData[]>('/api/vetuser/' + uid
       + '/message').toPromise();
  }

  openMessage($message: MessageData): void {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      width: '360px',
      data: $message
    });
    dialogRef.afterClosed().subscribe(() => {
      this.loadMessageData().then();
    });
  }
}
