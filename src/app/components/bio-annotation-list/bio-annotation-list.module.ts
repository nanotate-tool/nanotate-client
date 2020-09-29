import { NgModule } from '@angular/core';
import { CommonModule as ACommonModule } from '@angular/common';
import { BioAnnotationListComponent } from './bio-annotation-list.component';
import { TableModule } from "primeng/table";
import { CommonModule } from "../../common/common.module";

@NgModule({
  declarations: [BioAnnotationListComponent],
  imports: [
    ACommonModule,
    CommonModule,
    TableModule
  ],
  exports: [BioAnnotationListComponent]
})
export class BioAnnotationListModule { }
