import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Annotation, Nanopublication } from 'src/app/models';
import { NanopubsService } from 'src/app/services';
import { NANOPUBS } from "src/app/utils";
import { NgxTextDiffService } from "ngx-text-diff";
@Component({
  selector: 'a2np-c-nanopub-publisher',
  templateUrl: './nanopub-publisher.component.html',
  styleUrls: ['./nanopub-publisher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NanopubPublisherComponent implements OnInit, OnChanges {

  @Input() step: Annotation;
  @Input() annotations: Annotation[];

  /**
   * datos de la nanopublicacion que se esta presentando actualmente
   */
  nanopub: any;
  /**
   * modelo del menu de opciones
   */
  menuModel: MenuItem[];
  /**
   * ultima version de la nanopublicacion almacenada
   */
  remoteNanopublication: Nanopublication;
  /**
   * perspectiva del componente
   */
  perspective: 'rdf' | 'compare' = 'rdf';
  /**
   * determina si hay diferencia de la version del server
   */
  hasDiff: { have: boolean, amount: number };

  procesing: boolean = false;
  processing_message: string = 'Processing...';

  constructor(private nanopubsService: NanopubsService, private el: ChangeDetectorRef,
    private messageService: MessageService, private diffService: NgxTextDiffService) { }


  ngOnInit(): void {
    this.refresh();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const has_change = ['step', 'annotations'].reduce((a, f) => a || changes[f] && !changes[f].isFirstChange(), false);
    if (has_change) {
      this.refresh();
    }
  }

  /**
   * realiza el proceso de refrescado del estado general del componente
   */
  refresh() {
    this.remoteNanopublication = null;
    this.nanopub = null;
    this.perspective = 'rdf';
    this.procesing = true;
    this.hasDiff = { have: false, amount: 0 };
    Promise.all([
      this.fetchRemoteNanopub(),
      this.previewNanopub(),
    ]).then((a) => this.calculeIfhasDiff())
      .then(() => {
        console.log(this.hasDiff);
        this.buildMenuBarModel();
      }).finally(() => {
        this.procesing = false;
        this.el.markForCheck();
      })
  }

  _elresfresh() {
    this.el.markForCheck()
  }

  /**
   * determina si el componente es valido para realizar
   * sus procesos
   */
  get valid(): boolean {
    return this.step && this.annotations && true;
  }

  /**
   * realiza el registro o actualizacion de la nanopublicacion
   * a partir de las anotaciones pasadas
   */
  save() {
    this.procesing = true;
    this.processing_message = 'Publishing...';
    return new Promise((resolve, reject) => {
      if (this.valid) {
        resolve(
          this.nanopubsService
            .publish(NANOPUBS.rescueStepAnnotation(this.step.id, this.annotations))
            .then(response => {
              this.messageService.add({ severity: 'success', summary: 'Ok on publishing' })
              return response;
            })
        );
      } else {
        reject('Invalid Status')
      }
    }).catch(error => {
      this.messageService.add({ severity: 'error', summary: 'Error on publishing', detail: error })
    }).finally(() => {
      this.procesing = false;
      this.el.markForCheck();
      this.refresh();
    });
  }

  /**
   * genera el preview de la nanopublicacion que se puede
   * generar de las anotaciones pasadas
   */
  previewNanopub() {
    return new Promise((resolve, reject) => {
      this.processing_message = 'Generating Preview...';
      this.el.markForCheck();
      if (this.valid) {
        resolve(this.nanopubsService.previewOf(this.step.id, { annotations: this.annotations })
          .then(response => {
            this.nanopub = response;
            return this.nanopub;
          }));
      } else {
        reject('Invalid component status')
      }
    });
  }

  /**
   * consulta en la api la ultima version de la nanopublicacion
   * en la api
   */
  private fetchRemoteNanopub() {
    return new Promise((resolve) => {
      this.processing_message = 'Search nanopublication...';
      this.el.markForCheck();
      resolve(this.nanopubsService.nanopub(this.step.id)
        .then(response => {
          this.remoteNanopublication = response;
          this.el.markForCheck();
        }).catch(err => { })
      );
    });
  }

  private buildMenuBarModel() {
    this.menuModel = [
      { label: 'Reload', icon: "pi pi-refresh", command: () => this.refresh() },
      {
        label: this.perspective == 'rdf' ? 'Compare' : 'See rdf',
        icon: this.perspective == 'rdf' ? "pi pi-search" : "pi pi-file",
        command: () => {
          this.perspective = this.perspective != 'compare' ? 'compare' : 'rdf'
          this.buildMenuBarModel();
          this.el.markForCheck();
        },
        disabled: this.remoteNanopublication == null
      },
      { label: 'Publish nanopublication', icon: "pi pi-cloud-upload", command: () => this.save() }
    ];
  }

  /**
   * realiza el calculo si hay diferencias entre la nanopublicacion local con la
   * disponible en el server
   */
  private async calculeIfhasDiff() {
    if (this.nanopub?.rdf?.exact && this.remoteNanopublication?.rdf_raw?.exact) {
      this.processing_message = 'Analizing...';
      return this.diffService.getDiffsByLines(this.remoteNanopublication.rdf_raw.exact, this.nanopub.rdf.exact)
        .then(data => {
          const initialState = { have: false, amount: 0 };
          this.hasDiff = data.reduce((a, item) => {
            if (item.hasDiffs) {
              a.have = item.hasDiffs;
              a.amount = a.amount + 1;
            }
            return a;
          }, initialState);
          return this.hasDiff.have;
        })
    }
    return false;
  }

}
