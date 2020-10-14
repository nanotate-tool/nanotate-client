import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NanopubRdfBodyComponent } from './nanopub-rdf-body.component';
import { CommonModule as _Commons } from "../../common/common.module";

@NgModule({
  declarations: [NanopubRdfBodyComponent],
  imports: [
    CommonModule,
    _Commons
  ],
  exports: [NanopubRdfBodyComponent]
})
export class NanopubRdfBodyModule { }
