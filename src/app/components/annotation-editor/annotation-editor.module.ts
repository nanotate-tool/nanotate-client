import { NgModule } from '@angular/core';
import { CommonModule } from "../../common/common.module";
import { CommonModule as ACommonModule } from '@angular/common';
import { AnnotationEditorComponent } from './annotation-editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from "primeng/dropdown";
import { ButtonModule } from "primeng/button";
import { InputTextareaModule } from "primeng/inputtextarea";
import { MultiSelectModule } from "primeng/multiselect";
import { BioAnnotationListModule } from '../bio-annotation-list/bio-annotation-list.module';
import { LoadingPanelModule } from '../loading-panel/loading-panel.module';

@NgModule({
  declarations: [AnnotationEditorComponent],
  imports: [
    ACommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    ButtonModule,
    InputTextareaModule,
    BioAnnotationListModule,
    MultiSelectModule,
    LoadingPanelModule
  ],
  exports: [AnnotationEditorComponent]
})
export class AnnotationRegistrationModule { }
