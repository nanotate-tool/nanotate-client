import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnotationEditorComponent, AnnotationThreadListComponent } from 'src/app/components';
import { Annotation } from 'src/app/models';
import { AppService, HypothesisService, NanopubsService } from 'src/app/services';
import { BaseSubscriptionComponent, NANOPUBS } from 'src/app/utils';

@Component({
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent extends BaseSubscriptionComponent implements OnInit {

  /**
   * componente de actualizacion de las annotaciones
   */
  @ViewChild(AnnotationEditorComponent) annotationEditor: AnnotationEditorComponent;
  /**
   * componente de listado de las anotaciones
   */
  @ViewChild(AnnotationThreadListComponent) annotationsThread: AnnotationThreadListComponent;
  /**
   * perspectiva de la pagina actualmente
   */
  perspective: 'nanopub' | 'editor' | 'home' = 'home';
  /**
   * datos de la anotacion que se esta creando o editando
   */
  annotation: Annotation;
  /**
   * datos de la nanopublicacion que se esta presentando actualmente
   */
  nanopub: any = {};
  private __query: any;
  private uri_snapshot: string;

  constructor(private activeRoute: ActivatedRoute, private hypothesisService: HypothesisService,
    public app: AppService, private router: Router, private nanopubs: NanopubsService) {
    super();
  }

  ngOnInit(): void {
    this.uri_snapshot = this.app.siteData.url;
    // routing events
    this.addSubscription(this.activeRoute.queryParams.subscribe((params) => this.handleQueryParams(params)));
    // app reload
    this.addSubscription(this.app.subscribe('reload', () => this.refreshAnnotations()));
  }

  get query(): any {
    if (!this.__query) {
      this.__query = { limit: 200, url: this.app.siteData.url };
    }
    return this.__query;
  }

  /**
   * lanza el evento de actualizacion de las anotaciones
   * de la pagina
   * @param forceHome true para forzar la ida al home false de lo contrario
   */
  refreshAnnotations(forceHome: boolean = false) {
    if (forceHome || (this.uri_snapshot != this.app.siteData.url)) {
      this.perspective = 'home';
      this.uri_snapshot = this.app.siteData.url;
    }
    this.__query = null;
    //this.annotationsThread.search();
  }

  /**
   * controlador de los eventos sobre las anotaciones que se 
   * presenten en la pagina
   * @param args args
   */
  handleAnnotation(args: { action: any, annotation: Annotation, data?: any }) {
    switch (args.action) {
      case 'new':
      case 'edit': {
        this.annotation = args.annotation;
        if (this.annotationEditor) {
          this.annotationEditor.reload();
        }
        this.perspective = 'editor';
      } break;
      case 'nanopub': {
        this.perspective = 'nanopub';
        this.nanopub = args.data;
      }
      default:
    }
  }

  private handleQueryParams(params) {
    if (params.data) {
      const parseData = JSON.parse(params.data);
      this.nanopubs.settings.then(settings => {
        const annotation = this.hypothesisService.createAnnotationPayload(parseData);
        this.nanopubs.cleanUrl(annotation.uri).then(url => {
          annotation.uri = url;
          annotation.tags = settings.ontologies.map(ontology => NANOPUBS.encodeOntologyTag(ontology)).concat(annotation.tags || []);
          this.handleAnnotation({ action: 'new', annotation: annotation });
          this.router.navigate(['.'], { relativeTo: this.activeRoute });
          console.log(annotation)
        });
      });
    } else if (!this.annotation) {
      this.perspective = 'home';
    }
  }

}
