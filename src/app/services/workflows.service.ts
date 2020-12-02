import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Workflow } from '../models';

@Injectable({
  providedIn: 'root'
})
export class WorkflowsService {

  constructor(private httpClient: HttpClient) {
  }

  /**
   * returns all workflows that have relationship with protocol passed
   * @param protocol protocol url to get workflows
   */
  getWorkflows(protocol: string): Promise<Workflow[]> {
    return this.httpClient.get(this.apiUrl('workflows'), {
      params: { uri: protocol, rdf_format: 'json-html' }
    }).toPromise().then(response => <Workflow[]>response);
  }

  /**
   * returns the workflow associated to passed key
   * @param workflow_id workflow key
   */
  getWorkflow(workflow_id: string): Promise<Workflow> {
    return this.httpClient.get(this.apiUrl(`workflows/${workflow_id}`)).toPromise()
      .then(response => <Workflow>response);
  }

  /**
   * makes the process of save the workflow passed
   * if the serves was previous saved this updated it
   * @param workflow workflow to save
   */
  saveWorkflow(workflow: Workflow): Promise<any> {
    return this.httpClient.post(this.apiUrl('workflows'), workflow).toPromise()
      .then(response => <Workflow>response);
  }

  delete(workflow: Workflow): Promise<any> {
    return this.httpClient.delete(this.apiUrl(`workflows/${workflow.id}`)).toPromise()
      .then(response => response);
  }

  /**
   * genera una url basada en la url de acceso a la api
   * @param {string} url url a consultar basada en la api
   */
  protected apiUrl(url): string {
    return `${environment["an2p-api-host"]}/api/${url}`;
  }

}
