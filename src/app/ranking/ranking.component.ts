import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { getDoc, doc, collection, getDocFromCache } from 'firebase/firestore';

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
  constructor(private route: ActivatedRoute, public auth: Auth, public firestore: Firestore) { }

  async ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id']
      this.getRanking().then((res) => {
        this.ranking = res
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

}
