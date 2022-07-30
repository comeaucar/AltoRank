import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { getDoc, doc, collection, getDocFromCache } from 'firebase/firestore';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  constructor(private route: ActivatedRoute, public auth: Auth, public firestore: Firestore, public snackbar: MatSnackBar) { }

  async ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id']
      this.getRanking().then((res) => {
        this.ranking = res
        console.log(this.ranking)
      });
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
      return true;
    }
    return false
  }

  submitRankings() {
    
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
