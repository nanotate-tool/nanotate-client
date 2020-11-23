import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Annotation, SearchQuery } from 'src/app/models';
import { HypothesisService, NanopubsService } from 'src/app/services';
import { NANOPUBS, BaseSubscriptionComponent } from 'src/app/utils';

@Component({
  selector: 'a2np-c-annotation-thread-list',
  templateUrl: './annotation-thread-list.component.html',
  styleUrls: ['./annotation-thread-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnotationThreadListComponent extends BaseSubscriptionComponent implements OnInit, OnChanges {

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
  /**
   * contiene los annotations steps y su metadata
   */
  annotations_steps: { [key: string]: { metadata: any, step: Annotation } } = {};

  _filteredAnnotations: Annotation[] = null;

  filtersSchema: { label: string, key: string }[] = [{ label: 'Annotation step', key: 'stepGroup' }];

  filters: { stepGroup?: string } = { stepGroup: null };

  constructor(public hypothesisService: HypothesisService, private nanopubs: NanopubsService,
    private el: ChangeDetectorRef) { super(); }

  ngOnInit(): void {
    this.addSubscription(
      this.hypothesisService.onProfileChange((profile) => {
        this.procesing = !profile && true;
        if (profile) {
          console.log('refreshing')
          this.search();
        }
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['query'] && !changes['query'].firstChange) {
      this.search();
    }
  }

  reset() {
    this.annotations = null;
    this.annotations_steps = {};
    this._filteredAnnotations = null;
    this.filters = null;
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

  get isFiltersEmpty(): boolean {
    return !this.filters || this.filtersSchema.filter(schema => this.filters[schema.key]).length == 0;
  }

  get filteredAnnotations(): Annotation[] {
    if (!this._filteredAnnotations) {
      this._filteredAnnotations = this.annotations;
      if (this.filters?.stepGroup) {
        this._filteredAnnotations = this._filteredAnnotations.filter(annotation => annotation['n_group'] == this.filters.stepGroup);
      }
    }
    return this._filteredAnnotations;
  }

  /**
   * realiza la busqueda de las anotaciones para 
   * la query pasada
   */
  search() {
    if (!this.procesing) {
      this.procesing = true;
      this.el.markForCheck();
      this.hypothesisService.search(this.query)
        .then(response => {
          this.reset();
          this.annotations = response;
          this.group();
          this.el.markForCheck();
        })
        .finally(() => { this.procesing = false; });
    }
  }

  filterAt(key: string, value) {
    return this.filter({ [key]: value });
  }

  filter(filters: { [key: string]: any } = {}) {
    this.filters = { ...this.filters, ...filters };
    this._filteredAnnotations = null;
    this.el.markForCheck();
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
      this.annotations_steps = steps;
      this.annotations = this.annotations.map(annotation => {
        for (const group in steps) {
          const step = steps[group];
          if (NANOPUBS.annotationInsideIn(step.metadata, annotation)) {
            annotation['n_group'] = group;
          }
        }
        return annotation;
      }).sort((a, b) => {
        const result = a['n_group'] > b['n_group'] ? 1 : a['n_group'] == b['n_group'] ? 0 : -1;
        return result == 0 && NANOPUBS.isStepAnnotation(a) ? -1 : result;
      });
    }
  }

}
