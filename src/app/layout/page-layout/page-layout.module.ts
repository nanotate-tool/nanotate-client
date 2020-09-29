import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { AnnotatorBookmarkModule, SiteUrlEditorModule } from 'src/app/components';
import { PageComponent } from './components/page/page.component';
import { SlideMenuModule } from "primeng/slidemenu";
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [NavBarComponent, PageComponent],
  imports: [
    CommonModule,
    SiteUrlEditorModule,
    AnnotatorBookmarkModule,
    SlideMenuModule,
    ButtonModule
  ],
  exports: [PageComponent]
})
export class PageLayoutModule { }
