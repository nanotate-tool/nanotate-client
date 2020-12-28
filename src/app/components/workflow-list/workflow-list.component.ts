import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter, Input } from '@angular/core';
import { Workflow } from 'src/app/models';
import { AppService, WorkflowsService } from 'src/app/services';
import { BaseSubscriptionComponent } from 'src/app/utils';

@Component({
  selector: 'a2np-c-workflow-list',
  templateUrl: './workflow-list.component.html',
  styleUrls: ['./workflow-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowListComponent extends BaseSubscriptionComponent implements OnInit {

  @Input() showNewWorkflow: boolean = false;
  @Output() onNewWorkflow: EventEmitter<any> = new EventEmitter();

  workflows: Workflow[] = [];
  procesing: boolean = false;
  procesingMessage: string = "loading....";

  constructor(private app: AppService, private workflowsService: WorkflowsService, private el: ChangeDetectorRef) { super(); }

  ngOnInit(): void {
    if (this.app.siteData) {
      this.reload();
    } else {
      this.procesing = true;
    }
    this.addSubscription(
      this.app.subscribe('app-refresh', () => {
        this.procesing = true;
        this.procesingMessage = "Turn site url...";
        this.el.markForCheck();
      })
    );
    this.addSubscription(
      this.app.subscribe('app-ch-site-metadata', () => {
        this.reload();
      })
    );
  }

  get emptyWorkflows(): boolean {
    return this.workflows?.length <= 0;
  }

  reload() {
    this.procesing = true;
    this.procesingMessage = "Searching...";
    this.el.markForCheck();
    return Promise.all([
      this.fetchWorkflows()
    ]).finally(() => {
      this.procesing = false;
      this.el.markForCheck();
    })
  }

  fetchWorkflows() {
    return this.workflowsService.getWorkflows(this.app.siteData.url)
      .then(response => {
        this.workflows = response;
      }).catch(error => {
        this.workflows = [];
      })
  }

}
