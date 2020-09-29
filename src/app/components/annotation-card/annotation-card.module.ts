import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnotationCardComponent } from './annotation-card.component';

@NgModule({
  declarations: [AnnotationCardComponent],
  imports: [
    CommonModule
  ],
  exports: [AnnotationCardComponent]
})
export class AnnotationCardModule { }
