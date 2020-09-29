import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HypothesisSignInPageComponent, LandingPageComponent } from './pages';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'h/login', component: HypothesisSignInPageComponent },
  { path: 'nanopubs', loadChildren: () => import('./nanopubs/nanopubs.module').then(m => m.NanopubsModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
