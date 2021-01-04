import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsFilterFormComponent } from './stats-filter-form.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipsModule } from "primeng/chips";

@NgModule({
  declarations: [StatsFilterFormComponent],
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    ChipsModule
  ],
  exports: [StatsFilterFormComponent]
})
export class StatsFilterFormModule { }
