import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, Optional, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { NanopubHtml, Workflow } from 'src/app/models';
import { HypothesisService, WorkflowsService } from 'src/app/services';
import { NanopubRdfBodyDialogComponent } from '../nanopub-rdf-body/nanopub-rdf-body-dialog.component';

@Component({
  selector: 'a2np-c-workflow-action-bar',
  templateUrl: './workflow-action-bar.component.html',
  styleUrls: ['./workflow-action-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowActionBarComponent implements OnInit {

  @Input() workflow: Workflow;
  @Output() onNeedReload: EventEmitter<Workflow> = new EventEmitter();

  processing: boolean = false;

  constructor(private workflowService: WorkflowsService,
    private messageService: MessageService, @Optional() private confirmationService: ConfirmationService,
    public dialogService: DialogService, private el: ChangeDetectorRef, private hypothesisService: HypothesisService
  ) { }

  ngOnInit(): void {
  }

  /**
   * lanza un dialogo en cual se presenta el rdf de la nanopublicacion
   * @param nanopub datos de la nanopublicacion a presentar
   */
  showRdfOfNanopub(nanopub: NanopubHtml) {
    this.dialogService.open(NanopubRdfBodyDialogComponent, {
      header: 'workflow Nanopub',
      closable: true,
      closeOnEscape: false,
      data: {
        nanopub: nanopub
      }
    });
  }

  deleteWorkflow(workflow: Workflow) {
    return this.confirm().then(_continue => {
      if (_continue) {
        this.processing = true;
        this.el.markForCheck();
        return this.workflowService.delete(workflow)
          .then(response => {
            if (response.status == 'ok') {
              this.onNeedReload.emit(this.workflow)
              this.messageService.add({ severity: 'success', summary: 'Ok on delete Workflow' })
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error on delete Workflow', detail: response.message })
            }
            return response;
          }).finally(() => {
            this.processing = false;
            this.el.markForCheck();
          });
      }
      return false;
    });
  }

  confirm(message: string = 'Are you sure that you want delete this workflow?'): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.confirmationService) {
        this.confirmationService.confirm({
          message: message,
          accept: () => {
            resolve(true);
          },
          reject: () => {
            resolve(false);
          }
        });
      } else {
        resolve(true)
      }
    });
  }

  canPerform(action: string): boolean {
    switch (action) {
      case 'see_rdf':
        return true;
      case 'delete':
        action = 'delete';
      default:
        return this.hypothesisService.profileData && this.havePermissionFor(<any>action, this.hypothesisService.profileData.userid);
    }
  }

  havePermissionFor(action: 'delete' | 'update', user: string): boolean {
    return user && this.workflow?.permissions && this.workflow.permissions[action]
      && this.workflow.permissions[action].includes(user.trim());
  }

}
