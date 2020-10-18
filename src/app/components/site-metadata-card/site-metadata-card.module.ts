import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteMetadataCardComponent } from './site-metadata-card.component';

@NgModule({
  declarations: [SiteMetadataCardComponent],
  imports: [
    CommonModule
  ],
  exports: [SiteMetadataCardComponent]
})
export class SiteMetadataCardModule { }
