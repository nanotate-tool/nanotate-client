import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Annotation, SearchQuery } from 'src/app/models';
import { HypothesisService, NanopubsService } from 'src/app/services';
import { NANOPUBS } from 'src/app/utils';

@Component({
  selector: 'a2np-c-annotation-thread-list',
  templateUrl: './annotation-thread-list.component.html',
  styleUrls: ['./annotation-thread-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnotationThreadListComponent implements OnInit, OnChanges {

  @Input() query: SearchQuery;
  @Output() onAction: EventEmitter<{ action: 'edit' | 'delete' | 'nanopub', annotation, data?: any }> = new EventEmitter();

  /**
   * lista de annotaciones del componente
   */
  annotations: Annotation[] = [];
  /**
   * true si esta procesando una accion false de lo contrario
   */
  procesing: boolean = false;

  constructor(private hypothesisService: HypothesisService, private nanopubs: NanopubsService,
    private el: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.search();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['query'] && !changes['query'].firstChange) {
      this.search();
    }
  }

  /**
   * true si no encuentra ninguna anotacion false de lo contrario
   */
  get isEmpty(): boolean {
    return this.annotations && this.annotations.length <= 0;
  }

  /**
   * realiza la busqueda de las anotaciones para 
   * la query pasada
   */
  search() {
    if (!this.procesing) {
      this.procesing = true;
      this.hypothesisService.search(this.query)
        .then(response => {
          this.annotations = response;
          this.el.markForCheck();
        })
        .finally(() => { this.procesing = false; });
    }
  }

  /**
   * determina si se puede presentar el boton de nanopublicaciones
   * @param annotation annotacion
   */
  canShowNanopub(annotation: Annotation) {
    return annotation && NANOPUBS.isStepAnnotation(annotation);
  }

  edit(annotation: Annotation) {
    this.onAction.emit({
      action: 'edit',
      annotation: annotation
    });
  }

  nanopub(annotation: Annotation) {
    this.onAction.emit({
      action: 'nanopub',
      annotation: annotation,
      data: {
        step: annotation,
        annotations: this.annotations
      }
    });
  }

}
