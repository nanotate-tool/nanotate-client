import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { NanopubHtml } from 'src/app/models/nanopubs';

@Component({
  selector: 'a2np-c-nanopub-card',
  templateUrl: './nanopub-card.component.html',
  styleUrls: ['./nanopub-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NanopubCardComponent implements OnInit {

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
