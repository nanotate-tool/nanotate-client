import { Component, OnInit } from '@angular/core';
import { EssentialStats, SiteMetaData } from 'src/app/models';
import { AppService, StatsService } from 'src/app/services';
import { BaseSubscriptionComponent } from 'src/app/utils';

@Component({
  templateUrl: './stats-page.component.html',
  styleUrls: ['./stats-page.component.scss']
})
export class StatsPageComponent extends BaseSubscriptionComponent implements OnInit {

  stats: EssentialStats;
  procesingSitedata: boolean = true;

  constructor(private app: AppService, private statsService: StatsService) { super(); }

  ngOnInit(): void {
    this.addSubscription(
      this.app.subscribeSiteData((data) => {
        this.procesingSitedata = data && true;
      })
    )
    this.addSubscription(
      this.app.subscribe('reload', () => {
        this.fetchStats();
      })
    );
    if (this.app.fullLoaded) {
      this.fetchStats();
    }
  }

  /**
   * shortcut de obtencion de la metadata del sitio actual
   */
  get siteMetadata(): SiteMetaData {
    return this.app.siteData.metadata;
  }

  fetchStats() {
    return this.statsService.getEssential(this.app.siteData.url)
      .then(stats => {
        this.stats = stats ? stats[0] : null;
        return stats
      })
  }
}
