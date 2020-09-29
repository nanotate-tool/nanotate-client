import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppService, HypothesisService } from 'src/app/services';

@Component({
  selector: 'a2np-l-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent implements OnInit {

  @Input() fixed: boolean = false;
  @Input() items: MenuItem[];

  menu: MenuItem[] = [];

  constructor(private app: AppService, private hypothesis: HypothesisService) { }

  ngOnInit(): void {
    this.menu = this.defaultMenu();
  }

  private defaultMenu(): MenuItem[] {
    return [
      {
        icon: 'pi pi-user',
        label: 'Hypothesis Account',
        command:()=> this.hypothesis.requestUpdateOfUser(async ()=> true)
      }
    ];
  }

}
