import { Component, OnInit } from '@angular/core';
import {GlobalConstantService} from '../../services/global-constants.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {

  constructor(public constants: GlobalConstantService) { }

  ngOnInit(): void {
  }

}
