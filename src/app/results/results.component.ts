import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Auth } from '@angular/fire/auth';
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



  constructor(private router: Router, private route: ActivatedRoute, public auth: Auth, public firestore: Firestore, public snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id']
      this.getRanking().then((res) => {
        this.ranking = res 
        console.log(res)
        this.calcBorda()
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

  calcBorda() {
    this.ranking.choices.map((choice:any) => {
      console.log(choice);
      let borda = 0
      for (let i = 0; i < choice.rankCount.length; i++){
        borda += choice.rankCount[i] * (choice.rankCount.length - i - 1);
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

}
