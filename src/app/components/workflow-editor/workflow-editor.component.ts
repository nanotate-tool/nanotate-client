import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Nanopublication, Workflow } from 'src/app/models';
import { WorkflowsService } from 'src/app/services';

@Component({
  selector: 'a2np-c-workflow-editor',
  templateUrl: './workflow-editor.component.html',
  styleUrls: ['./workflow-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowEditorComponent implements OnInit {

  @Input() workFlow: Workflow;
  /**
   * nanopublications whit which to create
   */
  @Input() nanopubs: Nanopublication[];
  /**
   * event emitter when success saving the workflow
   */
  @Output() onSave: EventEmitter<Workflow> = new EventEmitter();

  private _form: FormGroup;
  private _seletecdNanopubs: Nanopublication[];
  procesing: boolean = false;

  constructor(private fb: FormBuilder, private workflowsService: WorkflowsService, private messageService: MessageService,
    private el: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  get form(): FormGroup {
    if (!this._form) {
      this._form = this.fb.group({
        label: [this.workFlow?.label, Validators.required],
        protocol: [this.workFlow?.protocol, Validators.required],
        description: [this.workFlow?.description, Validators.required],
        author: [this.workFlow?.author, Validators.required],
        nanopubs: [this.workFlow?.nanopubs || []]
      });
    }
    return this._form;
  }

  get selectedNanopubs(): Nanopublication[] {
    if (!this._seletecdNanopubs) {
      this._seletecdNanopubs = this.form.controls.nanopubs.value.map(value =>
        this.nanopubs.find(nanopub => nanopub.id == value)).filter(value => value && true);
    }
    return this._seletecdNanopubs;
  }

  private get updatedWorkflow(): Workflow {
    const workflow: Workflow = this.form.getRawValue();
    workflow.id = this.workFlow?.id;
    workflow.nanopubs = this.selectedNanopubs.map(nanopub => nanopub.id);
    return workflow;
  }

  save() {
    if (this.form.valid) {
      this.procesing = true;
      this.el.markForCheck();
      return this.workflowsService.saveWorkflow(this.updatedWorkflow)
        .then(response => {
          if (response.status == 'ok') {
            this.messageService.add({ severity: 'success', summary: 'Ok on publishing' })
            this.onSave.emit(response.data);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error on publishing', detail: response?.reason })
          }
          return response;
        }).finally(() => {
          this.procesing = false;
          this.el.markForCheck();
        });
    } else {
      for (const key in this.form.controls) {
        const control = this.form.controls[key];
        if (control.invalid) {
          this.messageService.add({ severity: 'error', summary: `Please, Fill this field '${key}'`, sticky: true });
        }
      }
      return Promise.reject('invalid-form')
    }
  }

}
