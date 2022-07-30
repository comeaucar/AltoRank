import { isNgTemplate } from '@angular/compiler';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  onAuthStateChanged
} from '@angular/fire/auth';

import { addDoc, Firestore, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  userLoggedIn: boolean = false;
  images = ['/assets/images/new-user.png', '/assets/images/forms.png', '/assets/images/document-collaboration.png']
  constructor(public auth: Auth, public firestore: Firestore) {
    
  }

  ngOnInit(): void {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
      }
    })
  }

 
  navCreate() {
    
  }
  

  
}
