import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { SiteMetaData } from '../models';
import { ProtocolsService } from './protocols.service';
/**
 * servicio central de control de la aplicacion
 */
@Injectable()
export class AppService {
  public static SITE_URL = 'a2np_siteUrl';
  /**
   * titulo del sitio
   */
  private get __siteUrl(): string { return localStorage.getItem(AppService.SITE_URL) };
  private set __siteUrl(value: string) {
    if (value)
      localStorage.setItem(AppService.SITE_URL, value)
    else
      localStorage.removeItem(AppService.SITE_URL);
  };
  /**
   * metadata del sitio
   */
  private __siteMetada: SiteMetaData;

  private __redirect: string;

  private __fullLoaded: boolean = false;

  private __observable: Subject<{ e: 'reload' | 'init-reload', args?: any }> = new Subject();
  private __metadata_behavior: BehaviorSubject<SiteMetaData> = new BehaviorSubject(null);

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private protocolsService: ProtocolsService) {
    // initial init
    this.init({ url: this.__siteUrl });
    // listen routing events
    this.activatedRoute.queryParams.subscribe(params => {
      this.checkQueryParams(this.activatedRoute.snapshot, true);
    });
  }

  init(args: { url: string }) {
    this.__fullLoaded = false;
    this.__siteMetada = null;
    this.__siteUrl = args.url;
    this.__metadata_behavior.next(this.__siteMetada);
    this.__observable.next({ e: 'init-reload', args: this });
    Promise.all(
      [this.fetchSiteMetadata()]
    ).then((data) => {
      // TODO
    }).finally(() => {
      this.__fullLoaded = true;
      this.__observable.next({ e: 'reload', args: args });
    })
  }

  /**
   * realiza la subscripcion a un evento para este servicio
   * @param e evento al cual se subscribe
   * @param sub controlador
   */
  subscribe(e: 'reload' | 'init-reload', sub: (args: any) => void): Subscription {
    return this.__observable.pipe(filter(event => event.e == e), map(event => event.args)).subscribe(sub);
  }

  /**
   * subscripcion a cualquier cambio que se pueda presentar en la metadata del sitio
   * @param sub controlador
   */
  subscribeSiteData(sub: (data: SiteMetaData) => void): Subscription {
    return this.__metadata_behavior.subscribe(sub);
  }

  /**
   * realiza el proceso de redirecion siempre y cuando el queryparam 'redirect'
   * se encuentre presente en la direccion actual de lo contrario se enviara a
   * la landing page de la app
   */
  continueAndRedirect(alternative: string = null) {
    this.redirect(this.__redirect || alternative || '/');
    this.__redirect = null;
  }

  /**
   * realiza el proceso de redireccion hacia una
   * pagina de la aplicacion
   * @param redirect pagina a redireccionar
   */
  redirect(redirect: any) {
    this.router.navigateByUrl(redirect);
  }

  checkQueryParams(route: ActivatedRouteSnapshot, redirect: boolean = true) {
    const params = route.queryParams;
    this.__redirect = params['redirect'];
    if (params['url'] && this.__siteUrl != params['url']) {
      this.init({ url: params['url'] });
      if (redirect) {
        const pathSegments = route['_urlSegment'].segments.map(sgmt => sgmt.path);
        const queryParams = { ...params, url: undefined };
        this.router.navigate(pathSegments, { queryParams });
      }
    }
  }

  /**
   * determina si el servicio esta inicializado
   * por lo minimo tiene la url del sitio a trabajar en la 
   * aplicacion
   */
  get hasInit(): boolean {
    return this.__siteUrl && true;
  }

  /**
   * retorna los datos base del sitio que se esta controlando actualmente
   */
  get siteData(): { url: string, metadata: SiteMetaData } {
    return { url: this.__siteUrl, metadata: this.__siteMetada };
  }

  /**
   * determina si todos los procesos de carga inicial o posterior a
   * un cambio de sitio se han completado
   * (no asegura carga sin errores)
   */
  get fullLoaded(): boolean {
    return this.__fullLoaded;
  }

  /**
   * retorna los valores configurados para
   * las variables pasadas
   * @param field campo a consultar
   */
  env(field: 'host' | 'an2p-api-host' | 'production') {
    return environment[field];
  }

  /**
   * obtiene la metadata del sitio que se esta trabajando actualmente
   * en la aplicacion
   */
  private fetchSiteMetadata(): Promise<SiteMetaData> {
    if (this.__siteUrl) {
      return this.protocolsService.getProtocol(this.__siteUrl)
        .then(response => {
          if (response && response.site_data) {
            this.__siteMetada = response.site_data;
            this.__metadata_behavior.next(this.__siteMetada)
          } else {
            this.__metadata_behavior.next(null)
          }
          return this.__siteMetada;
        });
    }
    return Promise.reject(`Bad URL <${this.__siteUrl}>`);
  }

}
