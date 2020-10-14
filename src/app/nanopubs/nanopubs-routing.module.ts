import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteUrlGuard } from '../guards';
import { NanopubsComponent } from './nanopubs.component';
import { RegisterPageComponent, NanopubsPageComponent } from './pages';

const routes: Routes = [
  {
    path: '', component: NanopubsComponent, canActivate: [SiteUrlGuard],
    children: [
      { path: 'register', component: RegisterPageComponent },
      { path: '', component: NanopubsPageComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NanopubsRoutingModule { }
