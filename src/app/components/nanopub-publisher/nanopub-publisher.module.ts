import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NanopubPublisherComponent } from './nanopub-publisher.component';
import { MenubarModule } from "primeng/menubar";
import { NanopubRdfBodyModule } from '../nanopub-rdf-body/nanopub-rdf-body.module';

@NgModule({
  declarations: [NanopubPublisherComponent],
  imports: [
    CommonModule,
    MenubarModule,
    NanopubRdfBodyModule
  ],
  exports: [NanopubPublisherComponent]
})
export class NanopubPublisherModule { }