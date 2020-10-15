import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Nanopublication } from 'src/app/models';

@Component({
  selector: 'a2np-c-nanopub-card',
  templateUrl: './nanopub-card.component.html',
  styleUrls: ['./nanopub-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NanopubCardComponent implements OnInit {

  @Input() layout: 'normal' | 'inline' = 'normal';
  @Input() nanopub: Nanopublication;

  constructor() { }

  ngOnInit(): void {
  }

}
