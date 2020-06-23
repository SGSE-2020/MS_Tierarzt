import { AfterViewInit, Component, OnInit, Inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import {GlobalConstantService} from '../../services/global-constants.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  email: string;
  password: string;

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
          }
        });
      }
    }
  }

  performLogin() {
    this.firebaseAuth.signInWithEmailAndPassword(this.email, this.password).then((result) => {
      result.user.getIdToken(true).then((token) => {
        this.httpClient.post(this.constants.host + '/user', {token}).subscribe((val: any) => {
            if (val.status === 'success'){
              this.constants.firebaseUser = result.user;
              console.log(this.constants.firebaseUser.toString());
            }
          });
      });
    });
  }

  performLogout(){
    this.constants.firebaseUser = null;
  }

  backToPortal(){
    window.location.href = 'http://portal.dvess.network';
  }
}
