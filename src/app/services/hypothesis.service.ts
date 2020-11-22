import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { HypothesisUserSigninDialogComponent } from '../components/hypothesis-user-signin/hypothesis-user-signin-dialog.component';
import { Annotation, HypothesisGroup, HypothesisProfile, SearchQuery } from '../models';
import { AppService } from './app.service';

declare var hlib;

declare type ServiceEvents = 'init-reload' | 'reload' | 'error-reload';

export const HYPOTHESIS_USER_REGEX_CLEAR = /(?<=acct:)(.*)(?=@)/g

export const clearHypothesisUser = (user: string) => {
  if (user) {
    let author_matcher = user.match(HYPOTHESIS_USER_REGEX_CLEAR);
    return author_matcher ? author_matcher.shift() : user;
  }
  return '';
}

@Injectable({
  providedIn: 'root'
})
export class HypothesisService {

  public static PUBLIC_GROUP = '__world__';
  private __profileData: HypothesisProfile;
  private __profileDataBehavior: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private httpClient: HttpClient, public dialogService: DialogService, private app: AppService) {
    this.reload();
  }

  /**
   * subscripcion de cuando se realiza algun cambio en la data del
   * perfil del usuario de hypothesis
   * @param sub controlador
   */
  onProfileChange(sub: (profile: any) => void): Subscription {
    return this.__profileDataBehavior.subscribe(sub);
  }

  /**
   * define los datos del usuario de hypothesis de la
   * session actual
   */
  get hypothesis_user(): { username: string, token: string } {
    return {
      username: hlib.getUser(),
      token: hlib.getToken()
    }
  }

  set hypothesis_user(value: { username: string, token: string }) {
    if (value) {
      localStorage.setItem('h_user', value.username);
      localStorage.setItem('h_token', value.token);
    } else {
      localStorage.removeItem('h_user');
      localStorage.removeItem('h_token');
    }
  }

  get selectedGroup(): HypothesisGroup {
    const localGroup = localStorage.getItem('h_group') || '__world__';
    return this.profileData.groups.find(group => group.id == localGroup);
  }

  set selectedGroup(value: HypothesisGroup) {
    const group = this.profileData.groups.find(group => group.id == value.id);
    localStorage.setItem('h_group', group?.id);
  }

  /**
   * hypothesis developer link (client token)
   */
  get hypothesisDeveloperLink(): string {
    return `${hlib.getSettings().service}/profile/developer`;
  }

  /**
   * determina si la instancia tiene el usuario de hypothesis 
   * correctamente
   */
  get haveUser(): boolean {
    return hlib.getToken() && true;
  }

  /**
   * datos de perfil del usuario de hypothesis
   */
  get profileData(): HypothesisProfile {
    return this.__profileData;
  }

  reload(withError: boolean = false, checkUser: boolean = false) {
    this.__profileData = null;
    this.__profileDataBehavior.next(this.__profileData);
    return Promise.all([
      new Promise(resolve => {
        if (this.haveUser || checkUser) {
          resolve(this.userProfile());
        } else {
          resolve(this.profileData);
        }
      })
    ]).catch((e) => {
      if (withError) { throw e; }
    })
  }

  /**
   * makes the check process if user token is valid in
   * hypothesis api
   * @param user username
   * @param token hypothesis user token
   */
  auth(user: string, token: string) {
    return this.hypothesisGetProfile(token).then(response => {
      this.hypothesis_user = { token: token, username: user }
      this.__profileData = response;
      this.__profileDataBehavior.next(this.__profileData);
      return true;
    });
  }

  /**
   * deletes all data of session for user and redirects to index
   */
  logout() {
    this.hypothesis_user = null;
    this.__profileData = null;
    this.__profileDataBehavior.next(null);
    this.app.init({ url: null });
    this.app.redirect('/');
  }

  createAnnotationPayload(params) {
    return JSON.parse(hlib.createAnnotationPayload(params));
  }

  /**
   * see http://jonudell.info/hlib/doc/modules/_hlib_.html#search
   * @param query query de busqueda
   */
  search(query: SearchQuery): Promise<Annotation[]> {
    return this.checkHypothesisUser(
      () => {
        query.group = this.selectedGroup?.id;
        return hlib.search(query).then(response => {
          if (response) {
            let annotations = [];
            response.forEach(arr => {
              annotations = annotations.concat(arr);
            });
            return annotations;
          }
          return [];
        });
      }
    );
  }

  /**
   * see http://jonudell.info/hlib/doc/modules/_hlib_.html#updateannotation
   * @param annotation annotation a actualizar
   */
  updateAnnotation(annotation: Annotation): Promise<any> {
    return this.checkHypothesisUser(
      () => {
        if (annotation.id) {
          const user = this.hypothesis_user;
          return hlib.updateAnnotation(annotation.id, user.token, JSON.stringify(annotation))
            .then(response => {
              if (response.response) {
                response.response = JSON.parse(response.response);
              }
              return response;
            });
        }
        return new Promise((resolve, reject) => reject('Annotation no have id'));
      }
    );
  }

  /**
   * realiza el proceso de publicar la annotacion pasada en la api
   * de hypothesis
   * see http://jonudell.info/hlib/doc/modules/_hlib_.html#postannotation
   * @param annotation annotacion a publicar
   */
  postAnnotation(annotation: Annotation): Promise<any> {
    return this.checkHypothesisUser(
      () => {
        const user = this.hypothesis_user;
        //annotation.username = user.username;
        annotation.group = annotation.group || '__world__';
        return hlib.postAnnotation(JSON.stringify(annotation), user.token)
          .then(response => {
            if (response.response) {
              response.response = JSON.parse(response.response);
            }
            return response;
          });
      }
    );
  }

  /**
   * realiza el proceso de eliminacion de la anotacion pasada
   * @param annotation annotation a eliminar
   */
  deleteAnnotation(annotation: Annotation): Promise<any> {
    return this.checkHypothesisUser(
      () => {
        const user = this.hypothesis_user;
        return hlib.deleteAnnotation(annotation.id, user.token)
          .then(response => {
            if (response.response) {
              response.response = JSON.parse(response.response);
            }
            return response.response;
          });
      }
    );
  }

  /**
   * realiza la busqueda de los datos de perfil del usuario 
   * de hypothesis de la instancia actual
   */
  userProfile(): Promise<HypothesisProfile> {
    return this.checkHypothesisUser(
      () => {
        return this.hypothesisGetProfile(this.hypothesis_user.token)
          .then(response => {
            this.__profileData = <HypothesisProfile>response;
            this.__profileDataBehavior.next(this.__profileData);
            return this.__profileData;
          }).catch(err => {
            return this.requestUpdateOfUser(async () => null);
          });
      }
    );
  }

  /**
   * lanza el dialogo de actualizacion de los datos de la cuenta para el usuario
   * de hypothesis
   * @param back funcion a llamar luego de los cambios
   * @param closable determina si se puede cerrar el dialogo
   */
  requestUpdateOfUser<T>(back: () => Promise<T>, closable: boolean = false): Promise<T> {
    return new Promise<T>((resolve) => {
      const dialogRef = this.dialogService.open(HypothesisUserSigninDialogComponent, {
        modal: true,
        closable: closable,
        closeOnEscape: closable,
        data: {
          showRemoveSession: true,
          backdoor: (destroy) => {
            dialogRef.close();
            if (destroy) {
              dialogRef.destroy();
            }
            resolve(back());
          }
        }
      });
    });
  }

  /**
   * realiza la verificacion del usuario de hypothesis para la instancia actual.
   * en caso de que el usuario no este seteado se procedera a mostrar un dialogo
   * en el cual se puede ingresar estos datos, una vez terminada esta verificacion
   * se procedera a llamar la funcion pasada
   * @param back funcion a llamar luego de la verificacion
   */
  checkHypothesisUser<T>(back: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve) => {
      if (!this.haveUser) {
        resolve(this.requestUpdateOfUser(back, false));
      } else {
        return resolve(back());
      }
    });
  }

  /**
   * makes request for get the user profile data associated with the passed token
   * @param user_token user token
   */
  private hypothesisGetProfile(user_token: string) {
    return this.httpClient.get(`${hlib.getSettings().service}/api/profile`, {
      headers: { 'authorization': `Bearer ${user_token}` }
    }).toPromise()
      .then(response => <HypothesisProfile>response)
      .then(response => {
        if (!response || !response.userid) {
          throw 'Bad User Token!!';
        }
        return response;
      })
      .catch(this.hypothesisHandleErrors());
  }

  private hypothesisHandleErrors() {
    return (error: Response) => {
      if (error instanceof Response) {
        return error.json()
          .then(error_data => {
            if (error_data && error_data.reason) {
              throw error_data.reason
            } else {
              throw 'Unknown error in hypothesis Api';
            }
          });
      }
      throw error;
    };
  }

}
