import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { SiteMetaData } from '../models';
import { ProtocolsService } from './protocols.service';

/**
 * events of service
 */
export type AppEvents = 'app-init' | 'app-refresh' | 'app-ch-site' | 'app-ch-site-metadata' | 'app-ch-hypothesis-account';
/**
 * central service for main control
 */
@Injectable()
export class AppService {
  public static SITE_URL = 'a2np_siteUrl';
  /**
   * site url (protocol)
   */
  private get __siteUrl(): string { return localStorage.getItem(AppService.SITE_URL) };
  private set __siteUrl(value: string) {
    if (value)
      localStorage.setItem(AppService.SITE_URL, value)
    else
      localStorage.removeItem(AppService.SITE_URL);
  };
  /**
   * site metadata
   */
  private __siteMetada: SiteMetaData;

  private __redirect: string;

  private __observable: Subject<{ [key: string]: any }> = new Subject();

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
    private protocolsService: ProtocolsService) {
    this.exec('app-init', this);
    // initial init
    this.reload({ url: this.__siteUrl });
    // listen routing events
    this.activatedRoute.queryParams.subscribe(params => {
      this.checkQueryParams(this.activatedRoute.snapshot, false);
    });
  }

  reload(args: { url: string }) {
    this.__siteMetada = null;
    this.__siteUrl = args.url;
    this.exec('app-refresh', this);
    this.exec('app-ch-site', this);
    return Promise.all(
      [this.fetchSiteMetadata()]
    ).then((data) => {
      this.exec('app-ch-site-metadata', this.__siteMetada);
    }).catch(err => {
      if (!['Bad URL <null>', 'Bad URL <>'].includes(err)) {
        console.error(err);
      }
    });
  }

  /**
   * makes subscription for passed event
   * @param e event name or list of events names
   * @param sub handler
   */
  subscribe(e: AppEvents | AppEvents[], sub: (args: any) => void): Subscription {
    let events: AppEvents[] = e instanceof Array ? e : [e];
    return this.__observable.pipe(
      filter(bevent => {
        const bkeys = Object.keys(bevent);
        return events.find(e => bkeys.includes(e)) && true;
      }),
      map(data => {
        return events.reduce((acc, e) => { return acc.concat(data[e]); }, []);
      })
    ).subscribe(sub);
  }

  /**
   * exec a app event for event name passed
   * @param e event name
   * @param args args of event
   */
  exec(e: AppEvents, args: any) {
    return this.__observable.next({ [e]: args });
  }

  /**
   * makes the process of redirection as long as the query param 'redirect'
   * has present in the current site url otherwise, is sent to the home page
   */
  continueAndRedirect(alternative: string = null) {
    this.redirect(this.__redirect || alternative || '/');
    this.__redirect = null;
  }

  /**
   * makes the process of redirect to any page in application
   * @param redirect page url
   */
  redirect(redirect: any) {
    this.router.navigateByUrl(redirect);
  }

  checkQueryParams(route: ActivatedRouteSnapshot, redirect: boolean = true) {
    const params = route.queryParams;
    this.__redirect = params['redirect'];
    if (params['url'] && this.__siteUrl != params['url']) {
      return this.reload({ url: params['url'] });
    }
  }

  /**
   * determines if the service has been init with minimum for correct work
   */
  get hasInit(): boolean {
    return this.__siteUrl && true;
  }

  /**
   * returns the base data of current site
   */
  get siteData(): { url: string, metadata: SiteMetaData } {
    return { url: this.__siteUrl, metadata: this.__siteMetada };
  }

  /**
   * returns the value of passed vars in app environment
   * @param field var name
   */
  env(field: 'host' | 'an2p-api-host' | 'production') {
    return environment[field];
  }

  /**
   * retrieve the current site metadata
   */
  private fetchSiteMetadata(): Promise<SiteMetaData> {
    if (this.__siteUrl) {
      return this.protocolsService.getProtocol(this.__siteUrl)
        .then(response => {
          if (response && response.site_data) {
            this.__siteUrl = response.site_data.uri;
            this.__siteMetada = response.site_data;
          }
          return this.__siteMetada;
        });
    }
    return Promise.reject(`Bad URL <${this.__siteUrl}>`);
  }

}
