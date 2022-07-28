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

  // handleRegister(value: any) {
  //   console.log(value)
  //   createUserWithEmailAndPassword(this.auth, value.email, value.password).then((res) => {
  //     console.log(res);
  //   }).catch((err) => {
  //     console.log(err)
  //   });
  // }

  handleLogin(value: any) {
    signInWithEmailAndPassword(this.auth, value.email, value.password).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err);
    })
  }

  addData(value: any) {
    const dbInstance = collection(this.firestore, 'newData');
    addDoc(dbInstance, value).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err)
    })
  }

  getData() {
    const dbInstance = collection(this.firestore, 'newData');
    getDocs(dbInstance).then((res) => {
      console.log(res.docs.map((item) => {
        return {...item.data(), id:item.id}
      }))
    })
  }
}
