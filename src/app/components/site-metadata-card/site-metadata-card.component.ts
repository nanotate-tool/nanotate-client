import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { SiteMetaData } from 'src/app/models';
import { AppService, ProtocolsService } from 'src/app/services';

@Component({
  selector: 'a2np-c-site-metadata-card',
  templateUrl: './site-metadata-card.component.html',
  styleUrls: ['./site-metadata-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteMetadataCardComponent implements OnInit {

  @Input() metadata: SiteMetaData;

  constructor() { }

  ngOnInit(): void {
  }

  get ngStyles() {
    return `--site-image: url(${this.metadata?.image});`;
  }

  get authors(): string {
    const authors = this.metadata?.authors ? this.metadata.authors.join(", ") : "";
    return authors || "Not found";
  }

  get type(): string {
    return this.metadata?._type ? this.metadata._type : 'Not found';
  }

}
