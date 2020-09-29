import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../services';

/**
 * controla que la aplicacion tenga la url del sitio que esta manejando
 */
@Injectable({
  providedIn: 'root'
})
export class SiteUrlGuard implements CanActivate {

  constructor(private _router: Router, private app: AppService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.app.checkQueryParams(route);
    if (!this.app.hasInit) {
      this._router.navigate([''], {
        queryParams: {
          redirect: state.url
        }
      });
      return false;
    }
    return true;
  }

}
