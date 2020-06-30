import { AfterViewInit, Component, OnInit, Inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import {GlobalConstantService} from '../../services/global-constants.service';
import { AngularFireAuth } from '@angular/fire/auth';
import {Router} from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface IVetUser {
  vid: string;
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
              private firebaseAuth: AngularFireAuth,
              private router: Router) {
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
      const userinfo = JSON.parse(localStorage.getItem('userinfo'));
      this.displayname = userinfo.firstName + ' ' + userinfo.lastName;
     /* console.log('Currentuser JSON ' + JSON.stringify(this.constants.currentUser));
      console.log('User JSON ' + JSON.stringify(user));
      if (this.constants.firebaseUser.uid !== this.constants.currentUser?.uid){
        this.constants.getCurrentUserData().then(() => {
          console.log('Currentuser After Get: '  + JSON.stringify(this.constants.currentUser));
          if (this.constants.currentUser == null){
            console.log('Currentuser is null');
            this.constants.performLogout();
          } else {
            this.constants.userRole = this.constants.currentUser.role;
            console.log(this.constants.userRole);
          }
        });
      }*/
    }
  }

  async performLogin() {
    this.firebaseAuth.signInWithEmailAndPassword(this.email, this.password).then((result) => {
      result.user.getIdToken(true).then((token) => {
        this.httpClient.post(this.constants.host + '/user', {token}).subscribe((val) => {
          this.constants.firebaseUser = result.user;
          this.constants.currentUser = val;
          localStorage.setItem('user', JSON.stringify(this.constants.firebaseUser));
          localStorage.setItem('userinfo', JSON.stringify(val));
          this.displayname = this.constants.currentUser.firstName + ' ' + this.constants.currentUser.lastName;
          this.createVetUser();
        });
      });
    });
  }

  async createVetUser() {
    this.vetUser = await this.httpClient.get<IVetUser>('api/vetuser/' + this.constants.firebaseUser.uid).toPromise();
    if (this.vetUser.vid === ''){
      this.httpClient.post('api/vetuser', {
        Uid: this.constants.currentUser.uid,
        FirstName: this.constants.currentUser.firstName,
        LastName: this.constants.currentUser.lastName,
        Gender: this.constants.currentUser.gender,
        IsEmployee: false,
        Dept: 0
      }).toPromise();
    }
    else {
      this.constants.isEmployee = this.vetUser.isEmployee;
    }
  }

  performLogout()
  {
    this.constants.performLogout();
    this.email = '';
    this.password = '';
    this.displayname = '';
    this.router.navigateByUrl('/home');
  }

  backToPortal(){
    window.location.href = 'http://portal.dvess.network';
  }
}
