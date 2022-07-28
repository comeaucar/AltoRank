import { Component, OnInit } from '@angular/core';
import {
  Auth,
} from '@angular/fire/auth';

import { addDoc, Firestore, collection, getDocs} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.css']
})
export class TrendingComponent implements OnInit {

  rankings: any = []
  rippleColor = "#CBC3E3"
  constructor(public auth: Auth, public firestore: Firestore, private router: Router) {
    console.log(auth.currentUser)
    this.getRankings()
   }

  ngOnInit(): void {
  }


  getRankings() {
    const dbInstance = collection(this.firestore, 'rankings');
    getDocs(dbInstance).then((res) => {
      this.rankings = res.docs.map((item) => {
        return {...item.data(), id:item.id}
      })
    })
  }

  navToRanking(id: any){
    console.log(id)
    this.router.navigate(['ranking', id]);
  }

}
