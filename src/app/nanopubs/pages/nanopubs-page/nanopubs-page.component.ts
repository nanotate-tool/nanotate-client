import { Component, OnInit } from '@angular/core';
import { Nanopublication } from 'src/app/models';
import { AppService, NanopubsService } from 'src/app/services';

@Component({
  templateUrl: './nanopubs-page.component.html',
  styleUrls: ['./nanopubs-page.component.scss']
})
export class NanopubsPageComponent implements OnInit {

  /**
   * lista de nanopublicaciones disponibles para el sitio actual
   */
  nanopubs: Nanopublication[];

  constructor(private app: AppService, private nanopubsService: NanopubsService) { }

  ngOnInit(): void {
    this.fetchNanopubs();
  }

  fetchNanopubs() {
    return this.nanopubsService.nanopubs(this.app.siteData.url)
      .then(response => {
        this.nanopubs = response;
      })
  }

}
