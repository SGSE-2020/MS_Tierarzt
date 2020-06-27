import { AfterViewInit, Component, OnInit, Inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import {GlobalConstantService} from '../../services/global-constants.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface IEmployee {
  isEmployee: boolean;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  email: string;
  password: string;
  displayname: string;
  employee: IEmployee;

  constructor(@Inject(DOCUMENT) document,
              private httpClient: HttpClient,
              public constants: GlobalConstantService,
              private firebaseAuth: AngularFireAuth) {
  }

  ngOnInit(): void {
    this.constants.userRole = 0;
    this.constants.authAction = 'login';

    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        this.constants.firebaseUser = user;
        localStorage.setItem('user', JSON.stringify(this.constants.firebaseUser));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  ngAfterViewInit(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    const isLoggedIn = (user !== null && user.emailVerified !== false) ? true : false;
    if (isLoggedIn){
      this.constants.firebaseUser = user;
      if (this.constants.firebaseUser.uid !== this.constants.currentUser?.uid){
        this.constants.getCurrentUserData().then(() => {
          if (this.constants.currentUser == null){
            this.constants.performLogout();
          } else {
            this.constants.userRole = this.constants.currentUser.role;
            console.log(this.constants.userRole);
          }
        });
      }
    }
  }

  async performLogin() {
    console.log('In login');
    this.firebaseAuth.signInWithEmailAndPassword(this.email, this.password).then((result) => {
      result.user.getIdToken(true).then((token) => {
        this.httpClient.post(this.constants.host + '/user', {token}).subscribe(() => {
          this.constants.firebaseUser = result.user;
          localStorage.setItem('user', JSON.stringify(this.constants.firebaseUser));
          this.displayname = this.constants.firebaseUser.displayname;
          this.createVetUser();
        });
      });
    });
  }

  async createVetUser() {
    console.log('Sending request to api');
    this.employee = await this.httpClient.get<IEmployee>('api/vetuser/' + this.constants.firebaseUser.uid).toPromise();
    console.log('Got employee value ' + this.employee.isEmployee);
    if (this.employee.isEmployee != null){
      this.constants.isEmployee = this.employee.isEmployee;
    }
    else {
      this.httpClient.post('api/vetuser', {
        Uid: this.constants.firebaseUser.uid,
        FirstName: this.constants.firebaseUser.firstName,
        LastName: this.constants.firebaseUser.lastName,
        Gender: this.constants.firebaseUser.gender,
        IsEmployee: false
      }).toPromise();
    }
  }

  performLogout()
  {
    this.constants.performLogout();
    this.email = '';
    this.password = '';
    this.displayname = '';
    window.location.href = 'http://tierarzt.dvess.network/home';
  }

  backToPortal(){
    window.location.href = 'http://portal.dvess.network';
  }
}
