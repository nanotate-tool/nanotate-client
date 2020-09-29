import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnotationThreadListComponent } from './annotation-thread-list.component';
import { AnnotationCardModule } from '../annotation-card/annotation-card.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [AnnotationThreadListComponent],
  imports: [
    CommonModule,
    AnnotationCardModule,
    ButtonModule
  ],
  exports: [AnnotationThreadListComponent]
})
export class AnnotationThreadListModule { }
