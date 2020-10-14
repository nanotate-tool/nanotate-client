import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Annotation } from 'src/app/models';
import { NanopubsService } from 'src/app/services';
import { NANOPUBS } from "src/app/utils";

@Component({
  selector: 'a2np-c-nanopub-publisher',
  templateUrl: './nanopub-publisher.component.html',
  styleUrls: ['./nanopub-publisher.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NanopubPublisherComponent implements OnInit {

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

  constructor(private nanopubsService: NanopubsService, private el: ChangeDetectorRef,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.menuModel = [
      { label: 'Publish', icon: "pi pi-save", command: () => this.save() },
      { label: 'Reload', icon: "pi pi-refresh", command: () => this.previewNanopub() }
    ];
    this.previewNanopub();
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

}
