import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Nanopublication } from 'src/app/models';
import { AppService, HypothesisService, NanopubsService } from 'src/app/services';
import { BaseSubscriptionComponent } from 'src/app/utils';

@Component({
  selector: 'a2np-c-nanopub-list',
  templateUrl: './nanopub-list.component.html',
  styleUrls: ['./nanopub-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NanopubListComponent extends BaseSubscriptionComponent implements OnInit {

  @Input() sticky: boolean = false;

  /**
   * lista de nanopublicaciones disponibles para el sitio actual
   */
  nanopubs: Nanopublication[];

  procesing: boolean = false;
  procesingMessage: string = "Searching...";

  constructor(private app: AppService, private nanopubsService: NanopubsService,
    public dialogService: DialogService, private el: ChangeDetectorRef, private hypothesis: HypothesisService) {
    super();
  }

  ngOnInit(): void {
    if (this.app.siteData.metadata) {
      this.reload();
    } else {
      this.procesing = true;
    }
    this.addSubscription(
      this.app.subscribe('app-refresh', () => {
        this.procesing = true;
        this.procesingMessage = "Turn site url...";
        this.el.markForCheck();
      })
    );
    this.addSubscription(
      this.app.subscribe(['app-ch-site-metadata', 'app-ch-hypothesis-account'], () => {
        if (this.app.siteData.metadata) {
          this.reload();
        }
        this.el.markForCheck();
      })
    );
  }

  get emptyNanopubs(): boolean {
    return this.nanopubs?.length <= 0;
  }

  /**
   * realiza el proceso de carga del componente
   */
  reload() {
    this.procesing = true;
    this.procesingMessage = "Searching...";
    this.el.markForCheck();
    return Promise.all([
      this.fetchNanopubs()
    ]).finally(() => {
      this.procesing = false;
      this.el.markForCheck();
    })
  }

  /**
   * realiza la consulta de las nanopublicaciones relacionadas
   * al sitio que esta manejando la app
   */
  fetchNanopubs() {
    return this.nanopubsService.nanopubs(this.app.siteData.url)
      .then(response => {
        this.nanopubs = response;
      }).catch(error => {
        this.nanopubs = [];
      })
  }

}