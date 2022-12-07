import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import {
  addDoc,
  Firestore,
  collection,
  getDocs,
} from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.css'],
})
export class TrendingComponent implements OnInit {
  rankings: any = [];
  rippleColor = '#CBC3E3';
  currSort: any;
  sortTypes = ['Popular', 'New'];
  cols: number = 0;

  gridByBreakpoint = {
    xl: 3,
    lg: 3,
    md: 3,
    sm: 2,
    xs: 1,
  };

  constructor(
    public auth: Auth,
    public firestore: Firestore,
    private router: Router,
    private route: ActivatedRoute,
    private clipboard: Clipboard,
    public snackbar: MatSnackBar,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((result) => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.XSmall]) {
            this.cols = this.gridByBreakpoint.xs;
          }
          if (result.breakpoints[Breakpoints.Small]) {
            this.cols = this.gridByBreakpoint.sm;
          }
          if (result.breakpoints[Breakpoints.Medium]) {
            this.cols = this.gridByBreakpoint.md;
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.cols = this.gridByBreakpoint.lg;
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.cols = this.gridByBreakpoint.xl;
          }
        }
      });
  }

  ngOnInit(): void {
    this.getRankings();
    this.route.queryParams.subscribe(
      (params) => (this.currSort = params['sort'])
    );
  }

  async getRankings() {
    const dbInstance = collection(this.firestore, 'rankings');
    await getDocs(dbInstance).then((res) => {
      this.rankings = res.docs.map((item) => {
        return { ...item.data(), id: item.id };
      });
      this.rankings.sort((a: any, b: any) => {
        if (this.currSort == 'popular') {
          if (a.submissions > b.submissions) {
            return -1;
          }
          return 1;
        } else {
          if (Date.parse(a.createdAt) - Date.parse(b.createdAt) >= 0) {
            return -1;
          }
          return 1;
        }
      });

      this.rankings = this.rankings.filter((x: any) => {
        if (x.hasOwnProperty('visible') && x.visible == false) {
          return false;
        }
        return true;
      });
    });
  }

  navToRanking(id: any) {
    this.router.navigate(['ranking', id]);
  }

  changeSort(event: any, val: any) {
    this.router
      .navigate(['find/'], {
        queryParams: { sort: event.value.toLowerCase() },
      })
      .then(() => window.location.reload());
  }

  shareRanking(rankingId: any) {
    this.clipboard.copy(`https://altorank.ca/ranking/${rankingId}`);
    this.snackbar.open('Copied ranking to clipboard!', 'Dismiss', {
      duration: 3000,
    });
  }
}
