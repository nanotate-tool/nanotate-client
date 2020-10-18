import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { HypothesisUserSigninDialogComponent } from '../components/hypothesis-user-signin/hypothesis-user-signin-dialog.component';
import { Annotation, HypothesisGroup, HypothesisProfile, SearchQuery } from '../models';

declare var hlib;

declare type ServiceEvents = 'init-reload' | 'reload' | 'error-reload';

@Injectable({
  providedIn: 'root'
})
export class HypothesisService {

  private __fullLoaded: boolean = false;
  private __profileData: HypothesisProfile;
  private __subject: Subject<{ e: ServiceEvents, args?: any }> = new Subject();
  private __profileDataBehavior: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private httpClient: HttpClient, public dialogService: DialogService) {
    this.reload();
  }

  /**
   * suscripcion a un evento que se presente en este servicio
   * @param event evento a escuchar
   * @param sub controlador
   */
  subscribe(event: ServiceEvents, sub: (args) => void): Subscription {
    return this.__subject.pipe(filter(e => e.e == event), map(e => e.args)).subscribe(sub);
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
    localStorage.setItem('h_user', value.username);
    localStorage.setItem('h_token', value.token);
    this.reload();
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
   * determina si el servicio esta completamente cargado
   */
  get fullLoaded(): boolean {
    return this.__fullLoaded;
  }

  /**
   * datos de perfil del usuario de hypothesis
   */
  get profileData(): HypothesisProfile {
    return this.__profileData;
  }

  reload(withError: boolean = false) {
    this.__fullLoaded = false;
    this.__subject.next({ e: 'init-reload' });
    return Promise.all([
      this.userProfile()
    ]).catch((e) => {
      this.__subject.next({ e: 'error-reload', args: e });
      if (withError) { throw e; }
    }).finally(() => {
      this.__subject.next({ e: "reload" });
      this.__fullLoaded = true;
    });
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
   * realiza la busqueda de los datos de perfil del usuario 
   * de hypothesis de la instancia actual
   */
  userProfile(): Promise<HypothesisProfile> {
    return this.checkHypothesisUser(
      () => {
        return this.httpClient.get(`${hlib.getSettings().service}/api/profile`, {
          headers: { 'authorization': `Bearer ${this.hypothesis_user.token}` }
        }).toPromise()
          .then(response => {
            this.__profileData = <HypothesisProfile>response;
            this.__profileDataBehavior.next(this.__profileData);
            return this.__profileData;
          });
      }
    );
  }

  /**
   * lanza el dialogo de actualizacion de los datos de la cuenta para el usuario
   * de hypothesis
   * @param back funcion a llamar luego de los cambios
   */
  requestUpdateOfUser<T>(back: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve) => {
      const dialogRef = this.dialogService.open(HypothesisUserSigninDialogComponent, {
        modal: true,
        closable: false,
        closeOnEscape: false,
        data: {
          backdoor: () => {
            dialogRef.close();
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
        resolve(this.requestUpdateOfUser(back));
      } else {
        return resolve(back());
      }
    });
  }

}
