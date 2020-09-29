import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteUrlGuard } from '../guards';
import { NanopubsComponent } from './nanopubs.component';
import { RegisterPageComponent } from './pages';

const routes: Routes = [
  {
    path: '', component: NanopubsComponent, canActivate: [SiteUrlGuard],
    children: [
      { path: 'register', component: RegisterPageComponent },
      { path: '', pathMatch: 'full', redirectTo: 'register' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NanopubsRoutingModule { }
