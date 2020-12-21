import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Annotation, BioAnnotation, Nanopublication } from '../models';
import { NanoPubApiConfig } from '../models/settings';
import { NANOPUBS } from '../utils';



@Injectable({
  providedIn: 'root'
})
export class NanopubsService {

  /**
   * default rdf format in app
   */
  private static default_rdf_format: string = 'json-html';
  private _settings: NanoPubApiConfig;
  private _settigs_puller: Observable<any>;

  constructor(private httpClient: HttpClient) {
  }

  /**
   * getting api settings
   */
  get settings(): Promise<NanoPubApiConfig> {
    if (this._settings) {
      return Promise.resolve(this._settings);
    } else {
      if (!this._settigs_puller)
        this._settigs_puller = this.httpClient.get(this.apiUrl('settings', false));

      return new Promise((resolve, reject) => {
        this._settigs_puller.subscribe((response) => {
          this._settings = response;
          resolve(response);
        }, reject);
      });
    }
  }

  /**
   * makes the process of cleaning of passed url in nanotate api
   * @param url url to be clean
   */
  cleanUrl(url: string): Promise<string> {
    return this.httpClient.get(this.apiUrl('cleanurl', false), {
      params: { uri: url }
    }).toPromise().then(response => {
      return response['uri'];
    });
  }

  /**
   * retorna la nanopublicacion relacionada al identificador pasado
   * @param id identificador de la nanopublicacion
   * @param for_compare true si el rdf es para comparacion false de lo contrario
   */
  nanopub(id: string, for_compare: boolean = false): Promise<Nanopublication> {
    const query_params = { rdf_format: NanopubsService.default_rdf_format };
    if (for_compare) {
      query_params['fcompare'] = '1'
    }
    return this.httpClient.get(this.apiUrl(`nanopub/${id}`), {
      params: query_params
    }).toPromise<any>()
      .then(this.parseNanopublication);
  }

  /**
   * retorna las nanopublicaciones relacionadas al protocolo 
   * asociado al uri pasado
   * @param protocol uri del protocolo
   */
  nanopubs(protocol: string): Promise<Nanopublication[]> {
    return this.httpClient.get(this.apiUrl('nanopub'), {
      params: { uri: protocol, rdf_format: NanopubsService.default_rdf_format }
    }).toPromise<any>()
      .then((response: any) => {
        if (response) {
          return response.map(this.parseNanopublication)
        }
        return response;
      });
  }

  /**
   * realiza la publicacion de las annotaciones
   * para su procesamiento en nanopublicaciones
   * @param annotations anotaciones
   */
  publish(annotations: Annotation[]) {
    const formatedAnnotaions = annotations.map(annotation => NANOPUBS.formatAnnotation(annotation));
    return this.httpClient.post(this.apiUrl('nanopub/rgs'), formatedAnnotaions).toPromise();
  }

  /**
   * realiza la eliminacion de la nanopublicacion pasada
   * @param nanopub nanopublicacion a eliminar
   */
  delete(nanopub: Nanopublication) {
    return this.httpClient.delete(this.apiUrl(`nanopub/${nanopub.id}`)).toPromise()
      .then(response => <any>response);
  }

  previewOf(annotationKey: string, thread: { annotations: Annotation[] }) {
    //const thread = null; // useStore(store => store.threadState());
    const stepAnnotation = thread.annotations.find(annotation => annotation.id === annotationKey && annotation.tags.includes('step'));
    if (stepAnnotation) {
      const stepMetadata = NANOPUBS.getAnnotationMetadata(stepAnnotation);
      const annotations = thread.annotations
        .filter(annotation => !NANOPUBS.isStepAnnotation(annotation))
        .filter(annotation => {
          const annotationMetadata = NANOPUBS.getAnnotationMetadata(annotation);
          return annotation.id != annotationKey && annotationMetadata.start >= stepMetadata.start && annotationMetadata.end <= stepMetadata.end;
        });
      return this.preview([stepAnnotation].concat(annotations)).then(response => response ? response[0] : null);
    }
    return new Promise((resolve) => { resolve(null) });
  }

  /**
   * genera el preview de las nanopublicaciones posibles para las anotaciones pasadas
   * @param annotations anotaciones
   */
  preview(annotations: Annotation[]) {
    const formatedAnnotaions = annotations.map(annotation => NANOPUBS.formatAnnotation(annotation));
    return this.httpClient.post(this.apiUrl('nanopub/preview?format=json-html'), formatedAnnotaions).toPromise();
  }


  /**
   * busca las annotaciones relacionadas al termino pasado que pertenescan 
   * al grupo de ontologias see bioportal api http://data.bioontology.org/documentation#nav_annotator
   * @param ontologies grupo de ontologias
   * @param label termino de busqueda de la annotacion
   */
  bioAnnotations(ontologies: string[], label: string): Promise<BioAnnotation[]> {
    return this.httpClient.get(this.apiUrl('bio/annotator'), {
      params: { text: label, ontologies: ontologies }
    }).toPromise().then(response => <BioAnnotation[]>response);
  }

  /**
     * genera una url basada en la url de acceso a la api
     * @param {string} url url a consultar basada en la api
     */
  protected apiUrl(url, with_api: boolean = true): string {
    return `${environment["an2p-api-host"]}/${with_api ? 'api/' : ''}${url}`;
  }

  protected parseNanopublication(nanopub: any): Nanopublication {
    if (nanopub) {
      if (nanopub.error) {
        throw nanopub.error;
      }
      nanopub['created_at'] = new Date(nanopub['created_at']);
      nanopub['updated_at'] = new Date(nanopub['updated_at']);
      return <Nanopublication>nanopub
    }
    return nanopub;
  }

}
