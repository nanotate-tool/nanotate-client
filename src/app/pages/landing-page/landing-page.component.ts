import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services';
import { BaseSubscriptionComponent } from 'src/app/utils';

@Component({
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent extends BaseSubscriptionComponent implements OnInit {

  constructor(private router: Router, private app: AppService) { super(); }

  ngOnInit(): void {
    if (this.app.hasInit) {
      this.next();
      return;
    }
    const onsetUrl = this.app.subscribe('reload', () => this.next());
    this.addSubscription(onsetUrl);
  }

  next() {
    this.app.continueAndRedirect('nanopubs/register');
  }

}
