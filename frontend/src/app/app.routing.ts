import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {CalendarComponent} from './components/calendar/calendar.component';
import {AdministrationComponent} from './components/administration/administration.component';
import {MessagesComponent} from './components/messages/messages.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { path: 'home', component: HomeComponent, runGuardsAndResolvers: 'always' },
  { path: 'calendar', component: CalendarComponent, runGuardsAndResolvers: 'always' },
  { path: 'administration', component: AdministrationComponent, runGuardsAndResolvers: 'always' },
  { path: 'messages', component: MessagesComponent, runGuardsAndResolvers: 'always' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})

export class RoutingModule { }
