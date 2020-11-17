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

  @Input() nanopub: Nanopublication;
  @Output() onNeedReload: EventEmitter<Nanopublication> = new EventEmitter();

  isProduction: boolean = false;

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
    return this.confirm().then(_continue => {
      if (_continue) {
        return this.nanopubsService.delete(nanopub)
          .then(response => {
            if (response.status == 'ok') {
              this.onNeedReload.emit(this.nanopub)
              this.messageService.add({ severity: 'success', summary: 'Ok on delete nanoPublication' })
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error on delete nanoPublication', detail: response.message })
            }
            return response;
          });
      }
      return false;
    });
  }

  confirm(message: string = 'Are you sure that you want delete this nano publication?'): Promise<boolean> {
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
        return this.havePermissionFor(<any>action, this.hypothesisService.profileData.userid);
    }
  }

  havePermissionFor(action: 'delete' | 'update', user: string): boolean {
    return user && this.nanopub?.permissions && this.nanopub.permissions[action]
      && this.nanopub.permissions[action].includes(user.trim());
  }

}
