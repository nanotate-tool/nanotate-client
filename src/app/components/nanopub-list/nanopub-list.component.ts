import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { NanopubHtml, Nanopublication } from 'src/app/models';
import { AppService, NanopubsService } from 'src/app/services';
import { BaseSubscriptionComponent } from 'src/app/utils';
import { NanopubRdfBodyDialogComponent } from '../nanopub-rdf-body/nanopub-rdf-body-dialog.component';

@Component({
  selector: 'a2np-c-nanopub-list',
  templateUrl: './nanopub-list.component.html',
  styleUrls: ['./nanopub-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NanopubListComponent extends BaseSubscriptionComponent implements OnInit {

  /**
   * lista de nanopublicaciones disponibles para el sitio actual
   */
  nanopubs: Nanopublication[];

  procesing: boolean = false;
  procesingMessage: string = "Searching...";

  constructor(private app: AppService, private nanopubsService: NanopubsService,
    public dialogService: DialogService, private el: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    if (this.app.fullLoaded) {
      this.reload();
    } else {
      this.procesing = true;
    }
    this.addSubscription(this.app.subscribe('init-reload', () => {
      this.procesing = true;
      this.procesingMessage = "Turn site url..."
      this.el.markForCheck();
    }));
    this.addSubscription(
      this.app.subscribe('reload', (data) => {
        this.reload()
      })
    );
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

  /**
   * lanza un dialogo en cual se presenta el rdf de la nanopublicacion
   * @param nanopub datos de la nanopublicacion a presentar
   */
  showRdfOfNanopub(nanopub: NanopubHtml) {
    this.dialogService.open(NanopubRdfBodyDialogComponent, {
      header: 'Nanopub',
      closable: true,
      closeOnEscape: false,
      data: {
        nanopub: nanopub
      }
    });
  }

}