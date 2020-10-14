import { Component, OnInit } from '@angular/core';
import { AppService } from '../services';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  templateUrl: './nanopubs.component.html'
})
export class NanopubsComponent implements OnInit {

  tabs: MenuItem[];
  activeTab: MenuItem;

  constructor(private app: AppService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.tabs = [
      { label: 'Nanopublications', icon: 'pi pi-list', routerLink:['.'] },
      { label: 'Annotations', icon: 'pi i-hypothesis-logo', routerLink: 'register' },
      { label: 'Stats', icon: 'pi pi-chart-line', routerLink: 'stats' }
    ];
    this.activeTab = this.tabs[0];
  }

  goToPage(page: any, query = undefined) {
    this.router.navigate(page, { relativeTo: this.activatedRoute, queryParams: query })
  }

}
