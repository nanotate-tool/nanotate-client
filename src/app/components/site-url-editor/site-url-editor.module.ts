import { Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteUrlEditorComponent } from './site-url-editor.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [SiteUrlEditorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule
  ],
  exports: [SiteUrlEditorComponent]
})
export class SiteUrlEditorModule { }
