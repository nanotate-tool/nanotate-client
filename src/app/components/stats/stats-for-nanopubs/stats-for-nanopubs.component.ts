import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { StatsFilterForm, StatsPaginationData } from 'src/app/models';
import { StatsService } from 'src/app/services';
import * as utils from "../utils";

@Component({
  selector: 'a2np-c-stats-for-nanopubs',
  templateUrl: './stats-for-nanopubs.component.html',
  styleUrls: ['./stats-for-nanopubs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsForNanopubsComponent implements OnInit, OnChanges {

  @Input() filter: StatsFilterForm;

  data: StatsPaginationData<any> = { page: { size: 40, totalRecords: 40, page: 1 } };
  procesing: boolean = false;
  cols = [
    { field: 'text', header: 'Text', class: 'c-txt' },
    { field: 'tag', header: 'Tag', class: 'c-tag' },
    { field: 'text_position', header: 'Text Position', class: 'c-pos' },
    { field: 'ontologies', header: 'Ontologies', class: 'c-ont' },
    { field: 'ontologies_term', header: 'Ontologies Comment', class: 'c-onc' }
  ]

  constructor(private el: ChangeDetectorRef, private statsService: StatsService) { }

  ngOnInit(): void {
    this.reload();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter'] && !changes['filter'].isFirstChange()) {
      this.reload();
    }
  }

  get isEmpty() {
    return !this.data || !this.data.data || this.data.data.length <= 0;
  }

  get dataForExport() {
    const data = this.data.data.map((item) => {
      const to_export = {}
      this.cols.forEach(col => {
        to_export[col.header] = item[col.field];
      });
      return to_export;
    });
    const headers = this.cols.map(col => col.header);
    return { headers: headers, data: data };
  }

  reload() {
    this.procesing = true;
    Promise.all([
      this.fetchData()
    ]).finally(() => {
      this.procesing = false;
      this.el.markForCheck();
    })
  }

  page(event) {
    this.data.page.page = (event.first / event.rows) + 1;
    return this.reload();
  }

  exportExcel() {
    return utils.exportExcel(this.dataForExport);
  }

  clearAsHtml(label: string) {
    return label ? label.replace(/,/g, "<br>") : label;
  }

  private fetchData() {
    return this.statsService.getNanopubStats(this.filter, this.data.page.page)
      .then(response => {
        this.data = response;
        console.log(this.data);
      });
  }

}
