import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowListComponent } from './workflow-list.component';
import { WorkflowCardModule } from '../workflow-card/workflow-card.module';
import { LoadingPanelModule } from '../loading-panel/loading-panel.module';
import { ButtonModule } from 'primeng/button';
import { WorkflowActionBarModule } from '../workflow-action-bar/workflow-action-bar.module';

@NgModule({
  declarations: [WorkflowListComponent],
  imports: [
    CommonModule,
    WorkflowCardModule,
    WorkflowActionBarModule,
    LoadingPanelModule,
    ButtonModule
  ],
  exports: [WorkflowListComponent]
})
export class WorkflowListModule { }
