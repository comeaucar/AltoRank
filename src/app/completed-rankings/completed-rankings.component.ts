import { Component, OnInit } from '@angular/core';
import { Firestore,query, where, getDocs } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { getDoc, doc, collection, getDocFromCache, addDoc, limit, FieldValue, updateDoc } from 'firebase/firestore';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-completed-rankings',
  templateUrl: './completed-rankings.component.html',
  styleUrls: ['./completed-rankings.component.css']
})
export class CompletedRankingsComponent implements OnInit {

  completedRankings: any = []
  currUser: any
  fRankings:any = []
  constructor(private router: Router ,private route: ActivatedRoute, public auth: Auth, public firestore: Firestore, public snackbar: MatSnackBar) { }

  ngOnInit(): void {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      this.currUser = user
      console.log(this.currUser.uid)
      this.getCompleted()
    })
  }

  async getCompleted() {
    const rankingsRef = collection(this.firestore, "completedRankings");
    const rankingQ = query(rankingsRef, where('userId', '==', this.currUser.uid))

    const querySnapshot = await getDocs(rankingQ);
    querySnapshot.forEach((doc:any) => {
      const fDoc = {
        data: doc.data(),
        id: doc.id
      }
      this.completedRankings.push(fDoc);
      this.getFormattedRanking(fDoc.data.rankingId).then((res) => {
        console.log(res)
        this.fRankings.push(res) 
      });
    })

    console.log(this.completedRankings)
  }

  async getFormattedRanking(id: any) {
      const docRef = doc(this.firestore, "rankings", id);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        return docSnap.data()
      } else {
        console.log("No document found")
        return null;
      }
    
  }

  navToRanking(id:any) {
    this.router.navigate(['results/' + id])
  }

}
