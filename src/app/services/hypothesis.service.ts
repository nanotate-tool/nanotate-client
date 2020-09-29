import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { HypothesisUserSigninDialogComponent } from '../components/hypothesis-user-signin/hypothesis-user-signin-dialog.component';
import { Annotation, AnnotationRequest, SearchQuery } from '../models';

declare var hlib;

@Injectable({
  providedIn: 'root'
})
export class HypothesisService {

  constructor(private httpClient: HttpClient, public dialogService: DialogService) { }

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
  userProfile(): Promise<any> {
    return this.checkHypothesisUser(
      () => {
        return this.httpClient.get(`${hlib.getSettings().service}/api/profile`, {
          headers: { 'authorization': `Bearer ${this.hypothesis_user.token}` }
        }).toPromise();
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
