import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NanopubsRoutingModule } from './nanopubs-routing.module';
import { RegisterPageComponent, NanopubsPageComponent } from './pages';
import {
  AnnotationRegistrationModule, AnnotationThreadListModule, LoadingPanelModule, NanopubCardModule,
  NanopubListModule, NanopubPublisherModule, NanopubRdfBodyModule, SiteMetadataCardModule, SiteUrlEditorModule
} from '../components';
import { NanopubsComponent } from './nanopubs.component';
import { PageLayoutModule } from '../layout';
import { TabMenuModule } from "primeng/tabmenu";
import { StatsPageComponent } from './pages/stats-page/stats-page.component';

@NgModule({
  imports: [
    CommonModule,
    PageLayoutModule,
    NanopubsRoutingModule,
    AnnotationRegistrationModule,
    AnnotationThreadListModule,
    NanopubRdfBodyModule,
    NanopubPublisherModule,
    NanopubCardModule,
    SiteUrlEditorModule,
    TabMenuModule,
    SiteMetadataCardModule,
    NanopubListModule,
    LoadingPanelModule
  ],
  declarations: [RegisterPageComponent, NanopubsComponent, NanopubsPageComponent, StatsPageComponent]
})
export class NanopubsModule { }
