import { isNgTemplate } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';

import { addDoc, Firestore, collection, getDocs} from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(public auth: Auth, public firestore: Firestore) {
    
  }

  ngOnInit(): void {}

 

  

  
}
