import { Component, OnInit } from '@angular/core';
import {
  Auth,
  getAuth,
  onAuthStateChanged
} from '@angular/fire/auth';

import {doc, addDoc, Firestore, collection, getDocs, query, where, deleteDoc} from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  confirmDelete: boolean = false;
  indexOfCardToDelete: number = 0;
  constructor(public auth: Auth, public firestore: Firestore, private router: Router, private snackBar: MatSnackBar) { }

  async ngOnInit() {
    const auth = getAuth();
    const user = auth.currentUser;
    this.currUserId = user?.uid
    this.currUserEmail = user?.email
    
    this.getRankings()
    
  }

  async getRankings() {
    const rankingsRef = collection(this.firestore, "rankings");
    const rankingQ = query(rankingsRef, where('createdBy', '==', this.currUserId))

    const querySnapshot = await getDocs(rankingQ);
    querySnapshot.forEach((doc) => {
      
      const fDoc = {
        data: doc.data(),
        id: doc.id
      }
      this.userRankings.push(fDoc);
    })
  }

  navToRanking(id: any){
    this.router.navigate(['ranking', id]);
  }

  deleteRanking(index: any) {
    this.confirmDelete = true;
    this.indexOfCardToDelete = index
  }

  deleteRankingZ(id: any) {
    const rankingToDelete = doc(this.firestore, 'rankings', id);
    deleteDoc(rankingToDelete).then(() => {
      this.snackBar.open("Ranking Successfully Deleted", "Dismiss");
      this.userRankings = []
      this.confirmDelete = false;
      this.getRankings()
    }).catch((err) => {
      this.snackBar.open("Error Deleting Ranking", "Dismiss");
    });
  }

  cancelDelete() {
    this.confirmDelete = false;
  }

}
