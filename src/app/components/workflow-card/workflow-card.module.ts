import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowCardComponent } from './workflow-card.component';
import { NanopubCardModule } from '../nanopub-card/nanopub-card.module';

@NgModule({
  declarations: [WorkflowCardComponent],
  imports: [
    CommonModule,
    NanopubCardModule
  ],
  exports: [WorkflowCardComponent]
})
export class WorkflowCardModule { }
