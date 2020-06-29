import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  OnInit,
  Inject,
  NgZone
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  addMinutes,
  addSeconds,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import {AppointmentInfo, CalendarDialogComponent} from './calendar-dialog/calendar-dialog.component';
import {RequestDialogComponent} from './request-dialog/request-dialog.component';
import {AppointmentDialogComponent} from './appointment-dialog/appointment-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {GlobalConstantService} from '../../services/global-constants.service';
import {IAnimalDataItem} from '../animal/animal.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

export interface AppointmentEvent extends CalendarEvent {
  animal?: string;
  cost?: number;
  appointmentid: string;
}

export interface AppointmentRequest {
  requestid: string;
  uid: string;
  start: string;
  end: string;
  animalid: string;
  reason: string;
}

export interface AppointmentData {
  appointmentid: string;
  uid: string;
  doctorid: string;
  start: string;
  end: string;
  cost: number;
  animalid: string;
  reason: string;
}

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent implements OnInit, AfterViewInit{
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  displayedColumns: string[] = ['uid', 'reason', 'animalid', 'start', 'end'];
  dataSource = new MatTableDataSource<AppointmentRequest>();
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  view: CalendarView = CalendarView.Month;
  appointmentData: AppointmentData[];
  appointmentRequests: AppointmentRequest[];

  CalendarView = CalendarView;
  uid: string;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  events: AppointmentEvent[] = [];

  activeDayIsOpen = false;

  constructor(private httpClient: HttpClient,
              public constants: GlobalConstantService,
              private modal: NgbModal,
              public dialog: MatDialog,
              private zone: NgZone) {
  }

  ngOnInit(): void {
    // if (this.constants.isEmployee) {
      this.dataSource.paginator = this.paginator;
      this.loadAppointmentRequests().then();
    // }
      this.loadAppointmentData().then();
  }

  ngAfterViewInit(): void {
    // if (this.constants.isEmployee) {
      this.loadAppointmentRequests().then();
    // }
      this.loadAppointmentData().then();
  }

  async openCalendarDialog($event: AppointmentEvent){
    console.log(JSON.stringify($event));
    const animalData = await this.httpClient.get<IAnimalDataItem>('/api/animal/' + $event.animal).toPromise();
    const appointmentInfo: AppointmentInfo = {
      reason: $event.title,
      date: $event.start,
      starttime: $event.start.toLocaleTimeString(),
      endtime: $event.end.toLocaleTimeString(),
      animalname: animalData.animalname
    };
    const dialogRef = this.dialog.open(CalendarDialogComponent, {
      width: '250px',
      data: appointmentInfo
    });
  }

  async openRequestDialog() {
    const userAnimals = await this.httpClient.get<IAnimalDataItem>('/api/vetuser/' + this.uid + '/animal').toPromise();
    const dialogRef = this.dialog.open(RequestDialogComponent, {
      width: '250px',
      data: userAnimals
    });
  }

  openAppointmentDialog($request: AppointmentRequest): void {
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      width: '250px',
      data: $request
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  async loadAppointmentData(){
    // TODO remove when pushing
    // this.uid = '6TbzcPavrSNdq1W1qAKqyfhhvxB2';
    await this.httpClient.get<AppointmentData[]>('/api/vetuser/' + this.uid + '/appointment').subscribe((val: any) => {
      this.appointmentData = val;
      this.events = [];
      for (const appointment of this.appointmentData){
        const startDate = this.createDateFromString(appointment.start);
        const endDate = this.createDateFromString(appointment.end);

        this.events = [
          ...this.events,
          {
            appointmentid: appointment.appointmentid,
            title: appointment.reason,
            animal: appointment.animalid,
            start: startDate,
            end: endDate,
            color: colors.red,
            cost: appointment.cost,
          },
        ];
      }
      this.zone.run(() => {
        console.log('enabled time travel');
      });
    });
  }

  async loadAppointmentRequests(){
    await this.httpClient.get<AppointmentData[]>('/api/appointmentrequest').subscribe((val: any) => {
      this.appointmentRequests = val;
      this.dataSource = new MatTableDataSource<AppointmentRequest>(this.appointmentRequests);
      this.dataSource.paginator = this.paginator;
    });
  }

  createDateFromString(inputstring: string): Date{
    const datestring = inputstring.split(' ', 2)[0];
    const timestring = inputstring.split(' ', 2)[1];

    const year = Number(datestring.split('-', 3)[0]);
    const month = Number(datestring.split('-', 3)[1]);
    const day = Number(datestring.split('-', 3)[2]);

    const hours = Number(timestring.split(':', 3)[0]);
    const minutes = Number(timestring.split(':', 3)[1]);
    const seconds = Number(timestring.split(':', 3)[2]);
    console.log(datestring);
    console.log(timestring);
    const date = new Date(year, month - 1, day, hours, minutes, seconds, 0);
    console.log(date.toLocaleString());
    return date;
  }
}
