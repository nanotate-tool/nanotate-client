import { Component, OnInit, ChangeDetectionStrategy, Input, Optional, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { NanopubHtml, Nanopublication } from 'src/app/models';
import { AppService, HypothesisService, NanopubsService } from 'src/app/services';
import { NanopubRdfBodyDialogComponent } from '../nanopub-rdf-body/nanopub-rdf-body-dialog.component';

@Component({
  selector: 'a2np-c-nanopub-action-bar',
  templateUrl: './nanopub-action-bar.component.html',
  styleUrls: ['./nanopub-action-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NanopubActionBarComponent implements OnInit {
  static CONFIRM_MESSAGE: string = 'Are you sure that you want delete this nano publication?';
  static CONFIRM_MESSAGE_WITH_WORKFLOW: string = `Are you sure that you want delete this nano publication?
    <div class="p-py-2 p-text-left">
      <strong class="p-invalid" >This nano publication has related workflows !!!</strong>
      <ul class="p-text-bold numbered-list">
        \${details}
      </ul>
    </div>
  ` ;

  @Input() nanopub: Nanopublication;
  @Output() onNeedReload: EventEmitter<Nanopublication> = new EventEmitter();

  isProduction: boolean = false;
  processing: boolean = false;

  constructor(private app: AppService, private nanopubsService: NanopubsService,
    private messageService: MessageService, @Optional() private confirmationService: ConfirmationService,
    public dialogService: DialogService, private el: ChangeDetectorRef, private hypothesisService: HypothesisService
  ) { }

  ngOnInit(): void {
    this.nanopubsService.settings.then(settings => {
      this.isProduction = !settings.test;
      this.el.markForCheck();
    })
  }

  get showRemoteRdf(): boolean {
    return this.isProduction && this.nanopub.publication_info && true;
  }

  /**
   * lanza un dialogo en cual se presenta el rdf de la nanopublicacion
   * @param nanopub datos de la nanopublicacion a presentar
   */
  showRdfOfNanopub(nanopub: NanopubHtml) {
    this.dialogService.open(NanopubRdfBodyDialogComponent, {
      header: 'Nanopub',
      closable: true,
      closeOnEscape: false,
      data: {
        nanopub: nanopub
      }
    });
  }

  deleteNanopub(nanopub: Nanopublication) {
    const confirmMessage = this.confirmationMessageForDeletion(nanopub);
    return this.confirm(confirmMessage).then(_continue => {
      if (_continue) {
        this.processing = true;
        this.el.markForCheck();
        return this.nanopubsService.delete(nanopub)
          .then(response => {
            if (response.status == 'ok') {
              this.onNeedReload.emit(this.nanopub)
              this.messageService.add({ severity: 'success', summary: 'Ok on delete nanoPublication' })
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error on delete nanoPublication', detail: response.message })
            }
            return response;
          }).finally(() => { this.processing = false; this.el.markForCheck(); });
      }
      return false;
    });
  }

  confirm(message: string = NanopubActionBarComponent.CONFIRM_MESSAGE): Promise<boolean> {
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
    return user && this.nanopub?.permissions && this.nanopub.permissions[action]
      && this.nanopub.permissions[action].includes(user.trim());
  }

  /**
   * calculates the confirmation message for deleting of passed nanopublication
   * @param nanopub nanopublication
   */
  private confirmationMessageForDeletion(nanopub: Nanopublication) {
    if (nanopub.hasWorkflows) {
      let confirmMessage = NanopubActionBarComponent.CONFIRM_MESSAGE_WITH_WORKFLOW;
      return confirmMessage.replace("${details}", nanopub.workflows.map(workflow => `<li>${workflow.label}</li>`).join(""));
    }
    return NanopubActionBarComponent.CONFIRM_MESSAGE;
  }

}
