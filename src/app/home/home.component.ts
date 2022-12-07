import { isNgTemplate } from '@angular/compiler';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
} from '@angular/fire/auth';

import {
  addDoc,
  Firestore,
  collection,
  getDocs,
} from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  userLoggedIn: boolean = false;
  closeResult = '';
  invalidEmail = false;
  invalidPassword = false;
  passwordsDoNotMatch = false;
  emailInUse = false;
  cols: number = 0;
  @ViewChild('signUpModal') signUpModal: any;
  images = [
    '/assets/images/new-user.png',
    '/assets/images/forms.png',
    '/assets/images/document-collaboration.png',
  ];

  gridByBreakpoint = {
    xl: 3,
    lg: 3,
    md: 3,
    sm: 2,
    xs: 1,
  };
  constructor(
    public auth: Auth,
    public firestore: Firestore,
    private modalService: NgbModal,
    public router: Router,
    private snackbar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((result) => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.XSmall]) {
            this.cols = this.gridByBreakpoint.xs;
          }
          if (result.breakpoints[Breakpoints.Small]) {
            this.cols = this.gridByBreakpoint.sm;
          }
          if (result.breakpoints[Breakpoints.Medium]) {
            this.cols = this.gridByBreakpoint.md;
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.cols = this.gridByBreakpoint.lg;
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.cols = this.gridByBreakpoint.xl;
          }
        }
      });
  }

  ngOnInit(): void {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('user logged');
        this.userLoggedIn = true;
      } else {
        console.log('no user');
      }
    });
  }

  navCreate() {
    if (!this.userLoggedIn) {
      const snackref = this.snackbar.open(
        'Must be logged in to create a poll',
        'Sign Up'
      );
      snackref.afterDismissed().subscribe(() => {
        this.open(this.signUpModal);
      });
    }
    this.router.navigate(['/create']);
  }

  signUpSubmit(value: any) {
    if (value.password != value.con_password) {
      this.passwordsDoNotMatch = true;
      return;
    }

    this.passwordsDoNotMatch = false;

    createUserWithEmailAndPassword(this.auth, value.email, value.password)
      .then((res) => {
        this.router.navigate(['home']).then(() => window.location.reload());
      })
      .catch((err) => {
        if ((err.code = 'auth/email-already-in-use')) {
          this.emailInUse = true;
        }
      });
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with ${result}`;
          this.invalidEmail = false;
          this.invalidPassword = false;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
