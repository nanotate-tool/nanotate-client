import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HypothesisUserSigninComponent } from './hypothesis-user-signin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { HypothesisUserSigninDialogComponent } from './hypothesis-user-signin-dialog.component';
import { LoadingPanelModule } from '../loading-panel/loading-panel.module';

@NgModule({
  declarations: [HypothesisUserSigninComponent, HypothesisUserSigninDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    LoadingPanelModule
  ],
  exports: [HypothesisUserSigninComponent]
})
export class HypothesisUserSigninModule { }
