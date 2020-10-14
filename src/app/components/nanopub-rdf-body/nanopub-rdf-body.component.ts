import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { NanopubHtml } from 'src/app/models';

@Component({
  selector: 'a2np-c-nanopub-rdf-body',
  templateUrl: './nanopub-rdf-body.component.html',
  styleUrls: ['./nanopub-rdf-body.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NanopubRdfBodyComponent implements OnInit {

  @Input() nanopub: NanopubHtml;

  __segments = [
    { key: '@Head', style: "head" },
    { key: '@assertion', style: "assertion" },
    { key: '@provenance', style: "provenance" },
    { key: '@pubInfo', style: "pubinfo" }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  get segments() {
    return this.__segments;
  }

}
