import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { AnnotatorBookmarkModule, SiteUrlEditorModule } from 'src/app/components';
import { PageComponent } from './components/page/page.component';
import { SlideMenuModule } from "primeng/slidemenu";
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ConfirmationService } from 'primeng/api';

@NgModule({
  declarations: [NavBarComponent, PageComponent],
  imports: [
    CommonModule,
    SiteUrlEditorModule,
    AnnotatorBookmarkModule,
    SlideMenuModule,
    ButtonModule,
    ConfirmDialogModule
  ],
  exports: [PageComponent],
  providers: [ConfirmationService]
})
export class PageLayoutModule { }
