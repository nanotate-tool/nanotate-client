import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsForNanopubsComponent } from './stats-for-nanopubs.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [StatsForNanopubsComponent],
  imports: [
    CommonModule,
    TableModule,
    ButtonModule
  ],
  exports: [StatsForNanopubsComponent]
})
export class StatsForNanopubsModule { }
