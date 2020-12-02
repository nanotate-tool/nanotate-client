import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NanopubCardComponent } from './nanopub-card.component';
import { ButtonModule } from "primeng/button";
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [NanopubCardComponent],
  imports: [
    CommonModule,
    ButtonModule,
    TooltipModule
  ],
  exports: [NanopubCardComponent]
})
export class NanopubCardModule { }
