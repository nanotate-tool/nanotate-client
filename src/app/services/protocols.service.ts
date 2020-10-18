import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Protocol } from '../models/protocols';

@Injectable({
  providedIn: 'root'
})
export class ProtocolsService {

  constructor(private httpClient: HttpClient) { }

  /**
   * retorna la informacion del protocolo asociado al uri pasado
   * @param uri url del protocolo a obtener la data
   */
  getProtocol(uri:string):Promise<Protocol>{
    return this.httpClient.get(this.apiUrl("protocols"), {
      params: { uri: uri }
    }).toPromise()
    .then(response => <Protocol> response);
  }

  /**
   * genera una url basada en la url de acceso a la api
   * @param {string} url url a consultar basada en la api
   */
  protected apiUrl(url): string {
    return `${environment["an2p-api-host"]}/${url}`;
  }

}