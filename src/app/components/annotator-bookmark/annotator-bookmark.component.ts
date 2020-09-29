import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { AppService } from 'src/app/services';

@Component({
  selector: 'a2np-c-annotator-bookmark',
  templateUrl: './annotator-bookmark.component.html',
  styleUrls: ['./annotator-bookmark.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnnotatorBookmarkComponent implements OnInit {
  @Input() withHelp: boolean = false;

  title: string = 'Nanopublications';

  constructor(private app: AppService) { }

  ngOnInit(): void {
  }

  /**
   * construye el link del bookmark
   */
  get link(): string {
    const appUrl = this.app.env('host');
    return `javascript:(function(){window['$_SITE_URL']='${appUrl}';var d=document; var s=d.createElement('script');s.setAttribute('src','${appUrl}/assets/s/gather.js');d.head.appendChild(s)})();`
  }

  preventsClick(event: Event) {
    event.preventDefault();
  }

}
