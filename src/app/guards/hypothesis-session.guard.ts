import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HypothesisService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class HypothesisSessionGuard implements CanActivate {

  constructor(private _router: Router, private hypothesis: HypothesisService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.hypothesis.haveUser) {
      if (this.hypothesis.profileData) {
        return true;
      } else {
        return this.hypothesis.userProfile()
          .then(() => {
            return true;
          })
      }

    } else {
      return this.hypothesis.requestUpdateOfUser(async () => true);
    }
  }

}
