import { Component, OnInit } from '@angular/core';
import { Auth, getAuth, onAuthStateChanged } from '@angular/fire/auth';

import {
  doc,
  addDoc,
  Firestore,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-created-rankings',
  templateUrl: './created-rankings.component.html',
  styleUrls: ['./created-rankings.component.css'],
})
export class CreatedRankingsComponent implements OnInit {
  currUserId: any;
  currUserEmail: any;
  userRankings: any = [];
  confirmDelete: boolean = false;
  indexOfCardToDelete: number = 0;
  confirmEdit: boolean = false;
  indexOfCardToEdit: number = 0;
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
    private snackBar: MatSnackBar,
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

  async ngOnInit() {
    const auth = getAuth();
    const user = auth.currentUser;
    this.currUserId = user?.uid;
    this.currUserEmail = user?.email;

    this.getRankings();
  }

  async getRankings() {
    const rankingsRef = collection(this.firestore, 'rankings');
    const rankingQ = query(
      rankingsRef,
      where('createdBy', '==', this.currUserId)
    );

    const querySnapshot = await getDocs(rankingQ);
    querySnapshot.forEach((doc) => {
      const fDoc = {
        data: doc.data(),
        id: doc.id,
      };
      this.userRankings.push(fDoc);
    });
  }

  navToRanking(id: any) {
    this.router.navigate(['ranking', id]);
  }

  deleteRanking(index: any) {
    if (this.indexOfCardToDelete == index) {
      this.confirmDelete = !this.confirmDelete;
    }
    this.confirmDelete = true;
    this.indexOfCardToDelete = index;
  }

  deleteRankingZ(id: any) {
    const rankingToDelete = doc(this.firestore, 'rankings', id);
    deleteDoc(rankingToDelete)
      .then(() => {
        this.snackBar.open('Ranking Successfully Deleted', 'Dismiss');
        this.userRankings = [];
        this.confirmDelete = false;
        this.getRankings();
      })
      .catch((err) => {
        this.snackBar.open('Error Deleting Ranking', 'Dismiss');
      });
  }

  cancelDelete() {
    this.confirmDelete = false;
  }

  editRanking(index: any) {
    if (this.indexOfCardToEdit == index) {
      this.confirmEdit = !this.confirmEdit;
      return;
    }
    this.confirmEdit = true;
    this.indexOfCardToEdit = index;
  }

  editRankingPrivacy(id: any, ranking: any) {
    const rankingToEdit = doc(this.firestore, 'rankings', id);

    updateDoc(rankingToEdit, {
      private: !ranking.data.private,
    }).then(() => {
      ranking.data.private = !ranking.data.private;
      if (ranking.data.private) {
        this.snackBar.open(
          ranking.data.title + ' results are now private',
          'Dismiss'
        );
      } else {
        this.snackBar.open(
          ranking.data.title + ' results are now public',
          'Dismiss'
        );
      }
    });
  }

  editRankingVisibility(id: any, ranking: any) {
    if (
      ranking.data.hasOwnProperty('visible') &&
      ranking.data.visible == true
    ) {
      ranking.data.visible = false;
    } else {
      ranking.data.visible = true;
    }
    const rankingToEdit = doc(this.firestore, 'rankings', id);
    updateDoc(rankingToEdit, {
      visible: ranking.data.visible,
    })
      .then(() => {
        if (!ranking.data.visible) {
          this.snackBar.open(ranking.data.title + ' is now hidden', 'Dismiss');
        } else {
          this.snackBar.open(ranking.data.title + ' is now visable', 'Dismiss');
        }
      })
      .catch((err) => {
        alert(err);
      });
  }

  hideEdit() {
    this.confirmEdit = false;
  }
}
