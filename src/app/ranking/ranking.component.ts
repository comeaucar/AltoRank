import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore,query, where, getDocs } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { getDoc, doc, collection, getDocFromCache, addDoc, limit, FieldValue, updateDoc } from 'firebase/firestore';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit, OnDestroy {

  ranking: any = {
    title: '',
    prompt: '',
    choices: []
  }
  id: string = ''
  private sub: any
  results: any = [];
  limitReached: boolean = false;
  currUser: any
  originalChoices:any
  constructor(private router: Router ,private route: ActivatedRoute, public auth: Auth, public firestore: Firestore, public snackbar: MatSnackBar) { }

  async ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id']
      this.getRanking().then((res) => {
        this.ranking = res 
      });
    })

    this.originalChoices = this.ranking
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      this.currUser = user
      this.checkCompleted()
    })

    
  }

  async checkCompleted() {
    const rankingsRef = collection(this.firestore, "completedRankings");
    const rankingQ = query(rankingsRef, where('userId', '==', this.currUser.uid), where('rankingId', '==', this.id))

    const querySnapshot = await getDocs(rankingQ);
    querySnapshot.forEach((doc:any) => {
      
      if (doc.data()) {
        if (this.ranking.private && this.ranking.createdBy != this.currUser.uid) {
          this.router.navigate(['completed-rankings'])
          this.snackbar.open("The results for this poll are private at this time", "Dismiss")
        } else {
          this.router.navigate(['results/' + this.id], {
            queryParams: {borda: "original"}
          }).then(() => window.location.reload())
        }
      }
    })
  }

  async getRanking() {
    const docRef = doc(this.firestore, "rankings", this.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      console.log("No document found")
      return null;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  checkLimit(): boolean{
    if (this.results.length >= this.ranking.rankLimit) {
      this.limitReached = true;
      return true;
    }
    this.limitReached = false;
    return false
  }

  submitRankings() {
    if (this.results.length != this.ranking.rankLimit) {
      this.snackbar.open(`Ranking length (${this.results.length}) does not equal limit (${this.ranking.rankLimit})`, "Dismiss");
      return;
    }
    const ndoc = {
      userId: this.currUser.uid,
      rankingId: this.id,
      submission: this.results,
      timeSubmitted: new Date().toLocaleString()
    }

    for (let i = 0; i < this.results.length; i++){
      this.results[i].rankCount[i]++;
    }
    const updateRanking = doc(this.firestore, 'rankings', this.id);
    updateDoc(updateRanking, {
      choices: this.results.concat(this.ranking.choices),
      submissions: this.ranking.submissions + 1
    }).then(() => {
      console.log("updated submissions")
    }).catch((err) => {
      console.log(err)
    })
    const dbInstance = collection(this.firestore, 'completedRankings');
    this.router.navigate(['results/' + this.id], {
      queryParams: {borda: 'original'}
    });
    addDoc(dbInstance, ndoc).then((res) => {
      const snackref = this.snackbar.open("Submitted!", "Dismiss", {
        duration: 5000
      })      
    }).catch((err) => {
      console.log(err)
    })
  }

  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
