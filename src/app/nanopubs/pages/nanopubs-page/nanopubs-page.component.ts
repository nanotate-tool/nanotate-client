import { Component, OnInit } from '@angular/core';
import { Nanopublication, SiteMetaData } from 'src/app/models';
import { AppService } from 'src/app/services';
import { BaseSubscriptionComponent } from "src/app/utils/components";

@Component({
  templateUrl: './nanopubs-page.component.html',
  styleUrls: ['./nanopubs-page.component.scss']
})
export class NanopubsPageComponent extends BaseSubscriptionComponent implements OnInit {

  /**
   * lista de nanopublicaciones disponibles para el sitio actual
   */
  nanopubs: Nanopublication[];
  procesingSitedata: boolean = true;

  constructor(private app: AppService) {
    super();
  }

  ngOnInit(): void {
    this.addSubscription(
      this.app.subscribeSiteData((data) => {
        this.procesingSitedata = data && true;
      })
    );
  }

  /**
   * shortcut de obtencion de la metadata del sitio actual
   */
  get siteMetadata(): SiteMetaData {
    return this.app.siteData.metadata;
  }

}
