import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './home/home.component';
import { RankingComponent } from './ranking/ranking.component';
import { TrendingComponent } from './trending/trending.component';
import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { CreatedRankingsComponent } from './created-rankings/created-rankings.component';
import { CompletedRankingsComponent } from './completed-rankings/completed-rankings.component';
import { NewComponent } from './new/new.component';
import { ResultsComponent } from './results/results.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'create', component: CreateComponent, canActivate: [AngularFireAuthGuard] },
  { path: 'trending', component: TrendingComponent },
  {path: 'newest', component: NewComponent},
  { path: 'ranking/:id', component: RankingComponent, canActivate: [AngularFireAuthGuard] },
  { path: 'created-rankings', component: CreatedRankingsComponent, canActivate: [AngularFireAuthGuard] },
  { path: 'completed-rankings', component: CompletedRankingsComponent, canActivate: [AngularFireAuthGuard] },
  {path: 'results/:id', component: ResultsComponent, canActivate: [AngularFireAuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
