import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NanopubListComponent } from './nanopub-list.component';
import { NanopubCardModule } from '../nanopub-card/nanopub-card.module';
import { ButtonModule } from "primeng/button";
import { LoadingPanelModule } from '../loading-panel/loading-panel.module';
import { NanopubActionBarModule } from '../nanopub-action-bar/nanopub-action-bar.module';

@NgModule({
  declarations: [NanopubListComponent],
  imports: [
    CommonModule,
    NanopubCardModule,
    LoadingPanelModule,
    ButtonModule,
    NanopubActionBarModule
  ],
  exports: [NanopubListComponent]
})
export class NanopubListModule { }
