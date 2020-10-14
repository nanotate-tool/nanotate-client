import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NanopubsRoutingModule } from './nanopubs-routing.module';
import { RegisterPageComponent, NanopubsPageComponent } from './pages';
import {
  AnnotationRegistrationModule, AnnotationThreadListModule, NanopubCardModule, NanopubPublisherModule,
  NanopubRdfBodyModule, SiteUrlEditorModule
} from '../components';
import { NanopubsComponent } from './nanopubs.component';
import { PageLayoutModule } from '../layout';
import { TabMenuModule } from 'primeng/tabmenu';

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
    TabMenuModule
  ],
  declarations: [RegisterPageComponent, NanopubsComponent, NanopubsPageComponent]
})
export class NanopubsModule { }
