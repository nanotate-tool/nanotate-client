import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { NanopubHtml } from 'src/app/models';

@Component({
  template: `
      <div [ngClass]="styleClass" class="p-px-5" style="max-width:1000px">
        <a2np-c-nanopub-rdf-body [nanopub]="nanopub" ></a2np-c-nanopub-rdf-body>
      </div>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NanopubRdfBodyDialogComponent implements OnInit {

  styleClass:string
  nanopub: NanopubHtml;

  constructor(private config: DynamicDialogConfig) {
    this.nanopub = config.data.nanopub;
    this.styleClass = config.data.styleClass;
  }

  ngOnInit(): void {
  }

}
