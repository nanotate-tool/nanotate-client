import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NanopubActionBarComponent } from './nanopub-action-bar.component';
import { ButtonModule } from "primeng/button";

@NgModule({
  declarations: [NanopubActionBarComponent],
  imports: [
    CommonModule,
    ButtonModule
  ],
  exports: [NanopubActionBarComponent]
})
export class NanopubActionBarModule { }
