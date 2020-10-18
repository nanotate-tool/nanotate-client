import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'a2np-c-loading-panel',
  templateUrl: './loading-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingPanelComponent implements OnInit {

  @Input() message: string;

  constructor() { }

  ngOnInit(): void {
  }

}
