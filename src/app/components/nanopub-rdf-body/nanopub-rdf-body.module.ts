import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NanopubRdfBodyComponent } from './nanopub-rdf-body.component';
import { NanopubRdfBodyDialogComponent } from "./nanopub-rdf-body-dialog.component";
import { CommonModule as _Commons } from "../../common/common.module";

@NgModule({
  declarations: [NanopubRdfBodyComponent, NanopubRdfBodyDialogComponent],
  imports: [
    CommonModule,
    _Commons
  ],
  exports: [NanopubRdfBodyComponent]
})
export class NanopubRdfBodyModule { }
