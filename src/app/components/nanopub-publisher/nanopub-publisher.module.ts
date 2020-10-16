import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NanopubPublisherComponent } from './nanopub-publisher.component';
import { MenubarModule } from "primeng/menubar";
import { NanopubRdfBodyModule } from '../nanopub-rdf-body/nanopub-rdf-body.module';
import { NanopubCardModule } from '../nanopub-card/nanopub-card.module';

@NgModule({
  declarations: [NanopubPublisherComponent],
  imports: [
    CommonModule,
    MenubarModule,
    NanopubRdfBodyModule,
    NanopubCardModule
  ],
  exports: [NanopubPublisherComponent]
})
export class NanopubPublisherModule { }
