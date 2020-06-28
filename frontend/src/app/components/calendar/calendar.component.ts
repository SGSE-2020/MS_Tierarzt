import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  OnInit,
  Inject
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
import {CalendarDialogComponent} from './calendar-dialog/calendar-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {GlobalConstantService} from '../../services/global-constants.service';

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
}

interface AppointmentData {
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

  view: CalendarView = CalendarView.Month;
  appointmentData: AppointmentData[];

  CalendarView = CalendarView;
  uid: string;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();

  events: AppointmentEvent[] = []/* = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: new Date(2020, 5, 28, 12, 0, 0, 0),
      end: addHours(new Date(2020, 5, 28, 12, 0, 0, 0), 3),
      title: 'Testevent',
      color: colors.yellow,
    },
  ]*/;

  activeDayIsOpen = true;

  constructor(private httpClient: HttpClient,
              public constants: GlobalConstantService,
              private modal: NgbModal,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.loadAppointmentData().then();
    this.uid = 'asd';
  }

  ngAfterViewInit(): void {
    this.loadAppointmentData().then();
  }

  openDialog($event: AppointmentEvent): void {
    const dialogRef = this.dialog.open(CalendarDialogComponent, {
      width: '250px',
      data: $event
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.animal = result;
    // });
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

  eventTimesChanged({
                      event,
                      newStart,
                      newEnd,
                    }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        animal: 'Amy',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  async loadAppointmentData(){
    await this.httpClient.get<AppointmentData[]>('/api/vetuser/' + this.uid + '/appointment').subscribe((val: any) => {
      this.appointmentData = val;
      for (const appointment of this.appointmentData){
        const startDate = this.createDateFromString(appointment.start);
        const endDate = this.createDateFromString(appointment.end);

        this.events = [
          ...this.events,
          {
            title: appointment.reason,
            animal: appointment.animalid,
            start: startDate,
            end: endDate,
            color: colors.red,
            cost: appointment.cost,
          },
        ];
      }
    });
  }

  createDateFromString(inputstring: string): Date{
    const datestring = inputstring.split(' ', 2)[0];
    const timestring = inputstring.split(' ', 2)[1];

    const starthours = timestring.split(':', 3)[0];
    const startminutes = timestring.split(':', 3)[1];
    const startseconds = timestring.split(':', 3)[2];

    const date = new Date(datestring);
    addHours(date, Number(starthours));
    addMinutes(date, Number(startminutes));
    addSeconds(date, Number(startseconds));

    return date;
  }
}
