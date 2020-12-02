import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowEditorComponent } from './workflow-editor.component';
import { PickListModule } from "primeng/picklist";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NanopubCardModule } from "../nanopub-card/nanopub-card.module";
import { ButtonModule } from "primeng/button";
import { WorkflowEditorDialogComponent } from './workflow-editor-dialog.component';
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { LoadingPanelModule } from '../loading-panel/loading-panel.module';

@NgModule({
  declarations: [WorkflowEditorComponent, WorkflowEditorDialogComponent],
  imports: [
    CommonModule,
    PickListModule,
    FormsModule,
    ReactiveFormsModule,
    NanopubCardModule,
    ButtonModule,
    InputTextareaModule,
    InputTextModule,
    LoadingPanelModule
  ],
  exports: [WorkflowEditorComponent, WorkflowEditorDialogComponent]
})
export class WorkflowEditorModule { }
