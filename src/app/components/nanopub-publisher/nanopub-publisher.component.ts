import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, OnChanges, SimpleChanges } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Annotation, Nanopublication } from 'src/app/models';
import { NanopubsService } from 'src/app/services';
import { NANOPUBS } from "src/app/utils";

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

  procesing: boolean = false;
  processing_message: string = 'Processing...';
  /**
   * ultima version de la nanopublicacion almacenada
   */
  remoteNanopublication: Nanopublication;

  constructor(private nanopubsService: NanopubsService, private el: ChangeDetectorRef,
    private messageService: MessageService) { }


  ngOnInit(): void {
    this.buildMenuBarModel();
    this.refresh()
  }

  ngOnChanges(changes: SimpleChanges): void {
    const has_change = ['step', 'annotations'].reduce((a, f) => a || changes[f] && !changes[f].isFirstChange(), false);
    if(has_change){
      this.refresh();
    }
  }

  refresh() {
    this.previewNanopub();
    this.fetchRemoteNanopub();
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
              this.refresh();
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
    });
  }

  /**
   * genera el preview de la nanopublicacion que se puede
   * generar de las anotaciones pasadas
   */
  previewNanopub() {
    this.procesing = true;
    this.processing_message = 'Generating Preview...';
    this.el.markForCheck();
    return new Promise((resolve, reject) => {
      if (this.valid) {
        resolve(this.nanopubsService.previewOf(this.step.id, { annotations: this.annotations })
          .then(response => {
            this.nanopub = response;
            return this.nanopub;
          }));
      } else {
        reject('Invalid Status')
      }
    }).finally(() => {
      this.procesing = false;
      this.el.markForCheck();
    });
  }

  /**
   * consulta en la api la ultima version de la nanopublicacion
   * en la api
   */
  private fetchRemoteNanopub() {
    return this.nanopubsService.nanopub(this.step.id)
      .then(response => {
        this.remoteNanopublication = response;
        this.el.markForCheck();
      }).catch(err=>{});
  }

  private buildMenuBarModel() {
    this.menuModel = [
      { label: 'Publish', icon: "pi pi-save", command: () => this.save() },
      { label: 'Reload', icon: "pi pi-refresh", command: () => this.refresh() }
    ];
  }

}
