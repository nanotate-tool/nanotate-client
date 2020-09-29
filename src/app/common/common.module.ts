import { NgModule } from '@angular/core';
import { CommonModule as NGCommonModule } from '@angular/common';
import { SafeSanitizePipe } from './pipes/safe-sanitize.pipe';

@NgModule({
  declarations: [SafeSanitizePipe],
  imports: [
    NGCommonModule
  ],
  exports: [SafeSanitizePipe],
})
export class CommonModule { }
