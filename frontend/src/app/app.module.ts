import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatSliderModule } from '@angular/material/slider';
import { HeaderComponent } from './components/header/header.component';
import { AnimalComponent } from './components/animal/animal.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { AdministrationComponent } from './components/administration/administration.component';
import { HomeComponent } from './components/home/home.component';
import { MessagesComponent } from './components/messages/messages.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { RoutingModule } from './app.routing';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {CdkTableModule} from '@angular/cdk/table';
import { MatTableModule  } from '@angular/material/table';
import { CalendarDialogComponent } from './components/calendar/calendar-dialog/calendar-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

import { GlobalConstantService } from './services/global-constants.service';
import {environment} from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AnimalComponent,
    AdministrationComponent,
    HomeComponent,
    MessagesComponent,
    CalendarComponent,
    CalendarDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    HttpClientModule,
    MatSliderModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    RoutingModule,
    CdkTableModule,
    MatTableModule,
    MatDialogModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    GlobalConstantService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
