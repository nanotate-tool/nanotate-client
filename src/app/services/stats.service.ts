import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CounterStats, EssentialStats, StatsFilterForm, StatsPaginationData } from '../models';
import { clearHypothesisUser } from './hypothesis.service';

export type StatsServiceGenericType = 'tags' | 'terms' | 'ontologies' | 'nanopubs-by-users';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private httpClient: HttpClient) { }

  getNanopubStats(filter: StatsFilterForm, page: number = 1): Promise<StatsPaginationData<any>> {
    return this.httpClient.get(this.apiUrl(`stats/nanopubs`), {
      params: { ...filter, page: page + "" }
    }).toPromise()
      .then(response => <any>response);
  }

  /**
   * realiza la obtencion de las estadisticas esenciales para el protocolo
   * @param protocol uri del protocolo a consultar
   */
  getEssential(filter: StatsFilterForm): Promise<EssentialStats> {
    return this.httpClient.get(this.apiUrl('stats'), {
      params: { ...filter }
    }).toPromise()
      .then(response => <EssentialStats>response);
  }

  getGenericStats(type: StatsServiceGenericType, filter: StatsFilterForm): Promise<CounterStats[]> {
    return this.httpClient.get(this.apiUrl(`stats/${type}`), {
      params: { ...filter }
    }).toPromise()
      .then(response => <CounterStats[]>response)
      .then(response => {
        switch (type) {
          case 'nanopubs-by-users':
            response = response.map(item => ({ ...item, label: clearHypothesisUser(item.label) }));
            break;
          default:
            break;
        }
        return response;
      });
  }

  /**
   * genera una url basada en la url de acceso a la api
   * @param {string} url url a consultar basada en la api
   */
  protected apiUrl(url): string {
    return `${environment["an2p-api-host"]}/api/${url}`;
  }

}
