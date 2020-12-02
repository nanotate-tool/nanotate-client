import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NanopubsRoutingModule } from './nanopubs-routing.module';
import { RegisterPageComponent, NanopubsPageComponent } from './pages';
import {
  AnnotationRegistrationModule, AnnotationThreadListModule, LoadingPanelModule, NanopubCardModule,
  NanopubListModule, NanopubPublisherModule, NanopubRdfBodyModule, SiteMetadataCardModule, SiteUrlEditorModule, WorkflowListModule
} from '../components';
import { NanopubsComponent } from './nanopubs.component';
import { PageLayoutModule } from '../layout';
import { TabMenuModule } from "primeng/tabmenu";
import { StatsPageComponent } from './pages/stats-page/stats-page.component';
import { ButtonModule } from 'primeng/button';

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
    WorkflowListModule,
    ButtonModule,
    LoadingPanelModule
  ],
  declarations: [RegisterPageComponent, NanopubsComponent, NanopubsPageComponent, StatsPageComponent]
})
export class NanopubsModule { }
