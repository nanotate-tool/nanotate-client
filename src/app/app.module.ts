import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HypothesisSignInPageComponent } from './pages/hypothesis-sign-in-page/hypothesis-sign-in-page.component';
import { AnnotatorBookmarkModule, HypothesisUserSigninModule, SiteUrlEditorModule } from './components';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SiteUrlGuard } from './guards';
import { AppService } from './services';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';

@NgModule({
  declarations: [
    AppComponent,
    HypothesisSignInPageComponent,
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    HypothesisUserSigninModule,
    SiteUrlEditorModule,
    AnnotatorBookmarkModule,
    DynamicDialogModule
  ],
  providers: [AppService, SiteUrlGuard, DialogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
