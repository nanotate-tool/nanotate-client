import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NanopubCardComponent } from './nanopub-card.component';
import { CommonModule as _Commons } from "../../common/common.module";

@NgModule({
  declarations: [NanopubCardComponent],
  imports: [
    CommonModule,
    _Commons
  ],
  exports: [NanopubCardComponent]
})
export class NanopubCardModule { }
