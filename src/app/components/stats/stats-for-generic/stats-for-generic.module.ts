import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsForGenericComponent } from './stats-for-generic.component';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { LoadingPanelModule } from '../../loading-panel/loading-panel.module';

@NgModule({
  declarations: [StatsForGenericComponent],
  imports: [
    CommonModule,
    ChartModule,
    TableModule,
    LoadingPanelModule
  ],
  exports: [StatsForGenericComponent]
})
export class StatsForGenericModule { }
