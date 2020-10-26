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

  constructor(public hypothesisService: HypothesisService, private nanopubs: NanopubsService,
    private el: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.hypothesisService.onProfileChange((profile) => {
      this.procesing = !profile && true;
    });
    if (this.hypothesisService.fullLoaded) {
      this.search();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['query'] && !changes['query'].firstChange) {
      this.search();
    }
  }

  /**
   * lista de grupos disponibles
   */
  get groups() {
    return this.hypothesisService.profileData?.groups;
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
          this.group();
          this.el.markForCheck();
        })
        .finally(() => { this.procesing = false; });
    }
  }

  proxyActionBarEvent(event) {
    const proxyed_event = {
      ...event,
      data: {
        annotations: this.annotations, ...event.data
      }
    };
    switch (event.action) {
      case 'delete': {
        this.search();
      } break;
      default: {
        this.onAction.emit(proxyed_event);
      }
    }
  }

  private group() {
    if (this.annotations) {
      const steps = this.annotations.filter(annotation => NANOPUBS.isStepAnnotation(annotation)).reduce((acc, annotation, index) => {
        const group = `N${index + 1}`;
        acc[group] = {
          metadata: { ...NANOPUBS.getAnnotationMetadata(annotation), id: annotation.id },
          step: annotation
        }
        annotation['n_group'] = group;
        return acc;
      }, {});
      this.annotations.forEach(annotation => {
        for (const group in steps) {
          const step = steps[group];
          if (NANOPUBS.annotationInsideIn(step.metadata, annotation)) {
            annotation['n_group'] = group;
          }
        }
      })
    }
  }

}
