import { Component, OnInit, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppService, HypothesisService } from 'src/app/services';
import { BaseSubscriptionComponent } from 'src/app/utils';

@Component({
  selector: 'a2np-l-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBarComponent extends BaseSubscriptionComponent implements OnInit {

  @Input() fixed: boolean = false;
  @Input() items: MenuItem[];

  menu: MenuItem[] = [];

  constructor(private app: AppService, private hypothesis: HypothesisService, private el: ChangeDetectorRef) { super(); }

  ngOnInit(): void {
    this.reload();
    this.addSubscription(
      this.app.subscribe("reload", () => this.reload())
    );
    this.addSubscription(
      this.hypothesis.onProfileChange(() => this.reload())
    );
  }

  reload() {
    this.menu = this.defaultMenu();
    this.el.markForCheck()
  }

  private defaultMenu(): MenuItem[] {
    const menu: MenuItem[] = [
      {
        icon: 'pi i-hypothesis-logo',
        label: 'Hypothesis Account',
        command: () => this.hypothesis.requestUpdateOfUser(async () => true, true)
      }
    ];
    //logout menu item
    if (this.hypothesis && this.hypothesis.haveUser) {
      menu.push(
        {
          icon: 'pi pi-sign-out',
          label: 'Sign out',
          command: () => this.hypothesis.logout()
        }
      );
    }
    return menu;
  }

}
