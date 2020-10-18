import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingPanelComponent } from './loading-panel.component';

@NgModule({
  declarations: [LoadingPanelComponent],
  imports: [
    CommonModule
  ],
  exports: [LoadingPanelComponent]
})
export class LoadingPanelModule { }
