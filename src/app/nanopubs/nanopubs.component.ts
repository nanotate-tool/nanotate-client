import { Component, OnInit } from '@angular/core';
import { AppService, HypothesisService } from '../services';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseSubscriptionComponent } from '../utils';

@Component({
  templateUrl: './nanopubs.component.html'
})
export class NanopubsComponent extends BaseSubscriptionComponent implements OnInit {

  loaded: boolean = true;
  tabs: MenuItem[];
  activeTab: MenuItem;

  constructor(private app: AppService, private router: Router, private activatedRoute: ActivatedRoute,
    private hypothesisService: HypothesisService) {
    super();
  }

  ngOnInit(): void {
    this.loadTabs();
    this.addSubscription(
      this.hypothesisService.subscribe(profile => {
        //this.loaded = profile && true;
      })
    );
  }

  goToPage(page: any, query = undefined) {
    this.router.navigate(page, { relativeTo: this.activatedRoute, queryParams: query })
  }

  loadTabs() {
    this.tabs = [
      { label: 'Nanopublications', icon: 'pi pi-list', routerLink: ['.'] },
      { label: 'Annotations', icon: 'pi i-hypothesis-logo', routerLink: 'register' },
      { label: 'Data Browser', icon: 'pi pi-chart-line', routerLink: 'stats' }
    ];
    this.activeTab = this.tabs[0];
  }

}
