import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  onAuthStateChanged
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  closeResult = ''
  invalidEmail = false
  invalidPassword = false;
  userLoggedIn = false;
  passwordsDoNotMatch = false;
  emailInUse = false;
  constructor(private modalService: NgbModal, public auth: Auth, public router: Router, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.userLoggedIn = true;
      }
    })
  }

  signOut() {
    this.auth.signOut().then(() => this.router.navigate(['home']).then(() => window.location.reload()));
  }

  signInSubmit(value: any) {
    signInWithEmailAndPassword(this.auth, value.email, value.password).then((res) => {
      this.modalService.dismissAll();
      this.snackbar.open("Welcome Back!", "Enjoy your time on AltoRank", {
        duration: 3000
      })
    }).catch((err) => {
      if (err.code = "auth/invalid-email") {
        this.invalidEmail = true;
      }
      if (err.code = "auth/invalid-password") {
        this.invalidPassword = true;
      }
    })
  }

  signUpSubmit(value: any) {
    if (value.password != value.con_password) {
      this.passwordsDoNotMatch = true;
      return;
    }

    this.passwordsDoNotMatch = false;

    createUserWithEmailAndPassword(this.auth, value.email, value.password).then((res) => {
      this.router.navigate(['home']).then(() => window.location.reload());
    }).catch((err) => {
      if (err.code = 'auth/email-already-in-use') {
        this.emailInUse = true;
      }
    })
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with ${result}`
      this.invalidEmail = false;
      this.invalidPassword = false
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
    })
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
