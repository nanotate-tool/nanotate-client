import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { EssentialStats, SiteMetaData, StatsFilterForm } from 'src/app/models';
import { AppService, StatsService } from 'src/app/services';
import { BaseSubscriptionComponent } from 'src/app/utils';

@Component({
  templateUrl: './stats-page.component.html',
  styleUrls: ['./stats-page.component.scss']
})
export class StatsPageComponent extends BaseSubscriptionComponent implements OnInit {

  filterForm: StatsFilterForm;
  perspective: 'tags' | 'users' | 'nanopubs' = 'tags';
  menuModel: MenuItem[] = [
    {
      label: 'Tags', icon: '', command:() => { this.perspective = 'tags'}
    },
    {
      label: 'Users', icon: '', command:() => { this.perspective = 'users'}
    },
    {
      label: 'Nano publications', icon: '', command:() => { this.perspective = 'nanopubs'}
    }
  ]

  constructor(private app: AppService, private statsService: StatsService) { super(); }

  ngOnInit(): void {
  }

  /**
   * shortcut de obtencion de la metadata del sitio actual
   */
  get siteMetadata(): SiteMetaData {
    return this.app.siteData.metadata;
  }

}
