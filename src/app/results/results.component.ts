import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Auth, getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { getDoc, doc, collection, getDocFromCache, addDoc, limit, FieldValue, updateDoc } from 'firebase/firestore';
@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit, OnDestroy {

  res: any = []
  private sub:any
  id: any;
  ranking: any;
  bordaOptions = ['Original', 'Tournament', 'Dowdall'];
  currBorda: any;


  view: any[] = [700, 370]
  schemeType:any = 'ordinal'
  xAxis = true;
  yAxis = true
  legendTitle = "Values"
  legendPosition = 'below'
  legend = true
  showXAxisLabel = true
  showYAxisLabel = true
  yAxisLabel = "Borda Count"
  xAxisLabel = "Values"
  animations = true;
  showGridLines = true
  showDataLabel = true
  barPadding = 5
  tooltipDisabled = false
  roundEdges = false
  cardColor: string = '#232837'
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  currUser:any


  constructor(private router: Router, private route: ActivatedRoute, public auth: Auth, public firestore: Firestore, public snackbar: MatSnackBar) { }

  ngOnInit(): void {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      this.currUser = user
    })
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id']
      this.getRanking().then((res) => {
        this.ranking = res
        if (this.ranking.private && this.ranking.createdBy != this.currUser.uid) {
          this.router.navigate(['completed-rankings'])
          this.snackbar.open("The results for this poll are private at this time", "Dismiss")
        }
        this.calcBorda()
      });
    })

    this.route.queryParams.subscribe(params => this.currBorda = params['borda'])

    console.log(this.currBorda)
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

  calcBorda() {
    this.ranking.choices.map((choice:any) => {
      let borda = 0
      for (let i = 0; i < choice.rankCount.length; i++){
        if (this.currBorda == 'tournament') {
          borda += choice.rankCount[i] * (choice.rankCount.length - i - 1);
        } else if (this.currBorda == 'dowdall') {
          borda += choice.rankCount[i] * (1 / (i + 1));
        } else {
          borda += choice.rankCount[i] * (choice.rankCount.length - i)
        }
      }
      let fRes = {
        name: choice.choice.value,
        value: borda
      }
      this.res.push(fRes)
    })

    this.res.sort((a: any, b:any) => {
      if (a.value > b.value) {
        return -1
      } else {
        return 1
      }
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  radioChange(event: any, val: any) {
    console.log(event)
    console.log(val)
    this.router.navigate(['results/' + this.id], {
      queryParams: {borda: event.value.toLowerCase()}
    }).then(() => window.location.reload())
  }

  redirectToBordaInfo() {
    let a = document.createElement('a')
    a.target = '_blank'
    a.href = 'https://en.wikipedia.org/wiki/Borda_count#:~:text=Tournament%2Dstyle%20counting%5B,in%201971.%5B7%5D'
    a.click()
  }

}
