import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NanopubsRoutingModule } from './nanopubs-routing.module';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { AnnotationRegistrationModule, AnnotationThreadListModule, NanopubRdfBodyModule, SiteUrlEditorModule } from '../components';
import { NanopubsComponent } from './nanopubs.component';
import { PageLayoutModule } from '../layout';

@NgModule({
  imports: [
    CommonModule,
    PageLayoutModule,
    NanopubsRoutingModule,
    AnnotationRegistrationModule,
    AnnotationThreadListModule,
    NanopubRdfBodyModule,
    SiteUrlEditorModule
  ],
  declarations: [RegisterPageComponent, NanopubsComponent]
})
export class NanopubsModule { }