import { AfterViewInit, Component, OnInit, Inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import {GlobalConstantService} from '../../services/global-constants.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface IVetUser {
  uid: string;
  firstName: string;
  lastName: string;
  gender: number;
  isEmployee: boolean;
  dept: number;
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
  vetUser: IVetUser;

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
          this.constants.currentUser = result.user;
          localStorage.setItem('user', JSON.stringify(this.constants.firebaseUser));
          this.displayname = this.constants.firebaseUser.displayname;
          this.createVetUser();
        });
      });
    });
  }

  async createVetUser() {
    console.log('Sending request to api');
    this.vetUser = await this.httpClient.get<IVetUser>('api/vetuser/' + this.constants.firebaseUser.uid).toPromise();
    console.log('Got employee uid ' + this.vetUser.uid);
    console.log('Got employee firstname ' + this.vetUser.firstName);
    console.log('Got employee lastname ' + this.vetUser.lastName);
    console.log('Got employee gender ' + this.vetUser.gender);
    console.log('Got employee value ' + this.vetUser.isEmployee);
    if (this.vetUser.isEmployee != null){
      this.constants.isEmployee = this.vetUser.isEmployee;
    }
    else {
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('Got firebase uid ' + this.constants.firebaseUser.uid);
      console.log('Got currentuser uid ' + this.constants.currentUser.uid);
      console.log('Got user uid ' + user.uid);
      this.httpClient.post('api/vetuser', {
        Uid: this.constants.firebaseUser.uid,
        FirstName: this.constants.firebaseUser.firstName,
        LastName: this.constants.firebaseUser.lastName,
        Gender: this.constants.firebaseUser.gender,
        IsEmployee: false,
        Dept: 0
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
