import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Workflow } from 'src/app/models';

@Component({
  selector: 'a2np-c-workflow-card',
  templateUrl: './workflow-card.component.html',
  styleUrls: ['./workflow-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowCardComponent implements OnInit {

  @Input() workflow: Workflow;

  constructor() { }

  ngOnInit(): void {
  }

}
