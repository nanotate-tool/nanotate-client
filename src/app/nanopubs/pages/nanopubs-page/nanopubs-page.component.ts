import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { NanopubListComponent, WorkflowEditorDialogComponent, WorkflowListComponent } from 'src/app/components';
import { Nanopublication, SiteMetaData, WorkflowRequest } from 'src/app/models';
import { AppService, HypothesisService, NanopubsService } from 'src/app/services';
import { BaseSubscriptionComponent } from "src/app/utils/components";

@Component({
  templateUrl: './nanopubs-page.component.html',
  styleUrls: ['./nanopubs-page.component.scss']
})
export class NanopubsPageComponent extends BaseSubscriptionComponent implements OnInit {

  /**
   * lista de nanopublicaciones disponibles para el sitio actual
   */
  @ViewChild(NanopubListComponent) nanopubsComponent: NanopubListComponent;
  @ViewChild(WorkflowListComponent) workflowsComponent: WorkflowListComponent;

  nanopubs: Nanopublication[];
  procesingSitedata: boolean = true;
  perspective: 'nanopubs' | 'workflows' = 'nanopubs';
  procesingNanopubs: boolean = false;

  constructor(private app: AppService, private dialogService: DialogService, private hypothesis: HypothesisService,
    private nanopubsService: NanopubsService, private messageService: MessageService) {
    super();
  }

  ngOnInit(): void {
    this.addSubscription(
      this.app.subscribeSiteData((data) => {
        this.procesingSitedata = data && true;
      })
    );
  }

  turnPerspective(perspective: 'nanopubs' | 'workflows') {
    this.perspective = perspective;
  }

  /**
   * shortcut de obtencion de la metadata del sitio actual
   */
  get siteMetadata(): SiteMetaData {
    return this.app.siteData.metadata;
  }

  /**
   * show modal for construction of new workflow
   */
  newWorkflow() {
    this.procesingNanopubs = true;
    return this.fetchNanopubs().then(nanopubs => {
      if (nanopubs && nanopubs.length > 0) {
        const dialog = this.dialogService.open(WorkflowEditorDialogComponent, {
          header: 'Workflow',
          closable: true,
          closeOnEscape: false,
          data: {
            nanopubs: nanopubs,
            onSave: () => {
              dialog.close();
              this.turnPerspective('workflows');
              this.makeReload();
            },
            workflow: <WorkflowRequest>{
              protocol: this.app.siteData.url,
              label: '',
              description: "",
              nanopubs: [],
              author: this.hypothesis.profileData.userid
            }
          }
        });
      } else {
        this.messageService.add({ severity: 'error', summary: "Error can't get nanopublications" });
      }
    }).finally(() => {
      this.procesingNanopubs = false;
    })
  }

  fetchNanopubs() {
    return this.nanopubsService.nanopubs(this.app.siteData.url)
      .then(response => {
        this.nanopubs = response;
        return this.nanopubs;
      }).catch(error => {
        this.nanopubs = [];
        return this.nanopubs;
      })
  }

  makeReload() {
    if (this.nanopubsComponent) {
      this.nanopubsComponent.reload();
    }
    if (this.workflowsComponent) {
      this.workflowsComponent.reload();
    }
  }

}
