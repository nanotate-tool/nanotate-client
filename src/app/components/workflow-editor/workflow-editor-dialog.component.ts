import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Nanopublication, Workflow } from 'src/app/models';

@Component({
    template: `
        <div style="max-width:90vw;min-width:600px;">
            <a2np-c-workflow-editor [nanopubs]="nanopubs" [workFlow]="workflow" (onSave)="save($event)" ></a2np-c-workflow-editor>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowEditorDialogComponent implements OnInit {

    constructor(private dialog: DynamicDialogConfig) { }

    ngOnInit(): void {
    }

    get nanopubs(): Nanopublication[] {
        return this.dialog?.data?.nanopubs;
    }

    get workflow(): Workflow {
        return this.dialog?.data?.workflow;
    }

    save(workflow: Workflow) {
        if (this.dialog.data.onSave) {
            this.dialog.data.onSave(workflow);
        }
    }

}