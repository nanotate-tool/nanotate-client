import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NanopubCardComponent } from './nanopub-card.component';
import { ButtonModule } from "primeng/button";

@NgModule({
  declarations: [NanopubCardComponent],
  imports: [
    CommonModule,
    ButtonModule
  ],
  exports: [NanopubCardComponent]
})
export class NanopubCardModule { }
