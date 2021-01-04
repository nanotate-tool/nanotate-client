import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { CounterStats, EssentialStats, StatsFilterForm } from 'src/app/models';
import { StatsService, StatsServiceGenericType } from 'src/app/services';
import { getLabelChartSettings, getTagChartSettings } from "../utils";

const StatsTypeSettings = {
  generic: {
    title: 'Data',
    table: {
      label: 'Label',
      count: 'Quantity'
    }
  },
  'tags': {
    title: 'Tags',
    table: {
      label: 'Tag',
      count: 'Quantity'
    }
  },
  'terms': {
    title: 'Terms',
    table: {
      label: 'Terms',
      count: 'Quantity'
    }
  },
  'ontologies': {
    title: 'Ontologies',
    table: {
      label: 'Ontologies',
      count: 'Nano publications'
    }
  },
  'nanopubs-by-users': {
    title: 'Nanopublications by user',
    table: {
      label: 'User Name',
      count: 'Nano publications'
    }
  }
}

@Component({
  selector: 'a2np-c-stats-generic',
  templateUrl: './stats-for-generic.component.html',
  styleUrls: ['./stats-for-generic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsForGenericComponent implements OnInit, OnChanges {

  @Input() type: StatsServiceGenericType = 'tags';
  @Input() filter: StatsFilterForm;
  @Input() showChart: boolean = true;
  @Input() showTable: boolean = true;

  typeSettings = StatsTypeSettings.tags;
  loaded: boolean = false;
  genericStats: CounterStats[] = null;
  chartModel: any;
  options = {}

  constructor(private el: ChangeDetectorRef, private statsService: StatsService) { }

  ngOnInit(): void {
    this.reload();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["filter"] && !changes['filter'].isFirstChange()) {
      this.reload();
    }
    if (changes['type']) {
      this.typeSettings = StatsTypeSettings[this.type] || StatsTypeSettings.generic;
    }
  }

  reload() {
    this.loaded = false;
    this.fetchStats();
  }

  get isTagsEmpty() {
    return !this.genericStats || this.genericStats.length <= 0;
  }

  private fetchStats() {
    this.loaded = false;
    return this.statsService.getGenericStats(this.type || 'tags', this.filter)
      .then(stats => {
        this.genericStats = stats;
        this.loadChartModel();
        this.el.markForCheck();
      }).finally(() => {
        this.loaded = true;
      });
  }

  private loadChartModel() {
    const pieModel = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
          hoverBackgroundColor: [],
        }
      ],
    }
    let settingsFunction = getLabelChartSettings;
    if (this.genericStats) {
      switch (this.type) {
        case 'tags':
          settingsFunction = getTagChartSettings;
        default:
          this.chartModel = this.genericStats.reduce((acc, stat) => {
            const settings = settingsFunction(stat.label);
            acc.labels.push(stat.label);
            acc.datasets[0].data.push(stat.count);
            acc.datasets[0].backgroundColor.push(settings.backgroundColor);
            acc.datasets[0].hoverBackgroundColor.push(settings.hoverBackgroundColor);
            return acc;
          }, pieModel)
          break;
      }
    }
  }

}
