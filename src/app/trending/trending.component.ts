import { Component, OnInit } from '@angular/core';
import {
  Auth,
} from '@angular/fire/auth';

import { addDoc, Firestore, collection, getDocs} from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.css']
})
export class TrendingComponent implements OnInit {

  rankings: any = []
  rippleColor = "#CBC3E3"
  currSort: any
  sortTypes = ['Popular', 'New']
  constructor(public auth: Auth, public firestore: Firestore, private router: Router, private route: ActivatedRoute) {
    this.getRankings()
    this.route.queryParams.subscribe(params => this.currSort = params['sort'])
   }

  ngOnInit(): void {
  }


  async getRankings() {
    const dbInstance = collection(this.firestore, 'rankings');
    await getDocs(dbInstance).then((res) => {
      this.rankings = res.docs.map((item) => {
        return {...item.data(), id:item.id}
      })
      this.rankings.sort((a:any, b:any) => {
        if (a.submissions > b.submissions) {
          return -1
        }
        return 1
      })
    })

  }

  navToRanking(id: any){
    this.router.navigate(['ranking', id]);
  }

  changeSort($event:any) {
    console.log()
  }

}
