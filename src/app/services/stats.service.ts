import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EssentialStats } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private httpClient: HttpClient) { }

  /**
   * realiza la obtencion de las estadisticas esenciales para el protocolo
   * @param protocol uri del protocolo a consultar
   */
  getEssential(protocol: string): Promise<EssentialStats> {
    return this.httpClient.get(this.apiUrl('stats'), {
      params: { uri: protocol }
    }).toPromise()
      .then(response => <EssentialStats>response);
  }

  /**
   * genera una url basada en la url de acceso a la api
   * @param {string} url url a consultar basada en la api
   */
  protected apiUrl(url): string {
    return `${environment["an2p-api-host"]}/${url}`;
  }

}
