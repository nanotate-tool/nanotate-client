import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnotationActionsBarComponent } from './annotation-actions-bar.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [AnnotationActionsBarComponent],
  imports: [
    CommonModule,
    ButtonModule
  ],
  exports: [AnnotationActionsBarComponent]
})
export class AnnotationActionsBarModule { }
