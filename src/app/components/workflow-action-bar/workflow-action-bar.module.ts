import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowActionBarComponent } from './workflow-action-bar.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [WorkflowActionBarComponent],
  imports: [
    CommonModule,
    ButtonModule
  ],
  exports: [WorkflowActionBarComponent]
})
export class WorkflowActionBarModule { }
