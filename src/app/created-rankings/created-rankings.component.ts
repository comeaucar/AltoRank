import { Component, OnInit } from '@angular/core';
import {
  Auth,
  getAuth,
  onAuthStateChanged
} from '@angular/fire/auth';

import { addDoc, Firestore, collection, getDocs, query, where} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-created-rankings',
  templateUrl: './created-rankings.component.html',
  styleUrls: ['./created-rankings.component.css']
})
export class CreatedRankingsComponent implements OnInit {

  currUserId: any;
  currUserEmail: any;
  userRankings: any = [];
  constructor(public auth: Auth, public firestore: Firestore, private router: Router) { }

  async ngOnInit() {
    const auth = getAuth();
    const user = auth.currentUser;
    this.currUserId = user?.uid
    this.currUserEmail = user?.email
    const rankingsRef = collection(this.firestore, "rankings");
    const rankingQ = query(rankingsRef, where('createdBy', '==', this.currUserId))

    const querySnapshot = await getDocs(rankingQ);
    querySnapshot.forEach((doc) => {
      console.log(doc.id)
      const fDoc = {
        data: doc.data(),
        id: doc.id
      }
      this.userRankings.push(fDoc);
    })

    console.log(this.userRankings)
  }

  navToRanking(id: any){
    this.router.navigate(['ranking', id]);
  }

}
