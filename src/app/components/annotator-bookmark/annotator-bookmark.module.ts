import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '../../common/common.module';
import { AnnotatorBookmarkComponent } from './annotator-bookmark.component';
import { CommonModule as ACommonModule } from "@angular/common";

@NgModule({
  declarations: [AnnotatorBookmarkComponent],
  imports: [
    ACommonModule,
    CommonModule,
    ButtonModule,
    TooltipModule
  ],
  exports: [AnnotatorBookmarkComponent]
})
export class AnnotatorBookmarkModule { }
