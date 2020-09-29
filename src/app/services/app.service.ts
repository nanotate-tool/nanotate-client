import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
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
   * titulo del sitio que se esta controlando actualmente
   */
  private __siteTitle: string;

  private __redirect: string;

  private __observable: Subject<{ e: 'reload', args?: any }> = new Subject();

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    // listen routing events
    this.activatedRoute.queryParams.subscribe(params => {
      this.checkQueryParams(this.activatedRoute.snapshot, true);
    });
  }

  init(args: { url: string }) {
    this.__siteUrl = args.url;
    this.calculateUrlTitle();
    this.__observable.next({ e: 'reload', args: args });
  }

  /**
   * realiza la subscripcion a un evento para este servicio
   * @param e evento al cual se subscribe
   * @param sub controlador
   */
  subscribe(e: 'reload', sub: (args: any) => void): Subscription {
    return this.__observable.pipe(filter(event => event.e == e), map(event => event.args)).subscribe(sub);
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
   * determina si el servicio 
   */
  get hasInit(): boolean {
    return this.__siteUrl && true;
  }

  /**
   * retorna los datos base del sitio que se esta controlando actualmente
   */
  get siteData(): { url: string, title: string } {
    return { url: this.__siteUrl, title: this.__siteTitle };
  }

  /**
   * retorna los valores configurados para
   * las variables pasadas
   * @param field campo a consultar
   */
  env(field: 'host' | 'an2p-api-host') {
    return environment[field];
  }

  private calculateUrlTitle() {
    if (this.__siteUrl) {
      this.__siteTitle = this.__siteUrl;
    }
  }

}
