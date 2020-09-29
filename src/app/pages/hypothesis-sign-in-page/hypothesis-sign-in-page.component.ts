import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services';

@Component({
  templateUrl: './hypothesis-sign-in-page.component.html',
  styleUrls: ['./hypothesis-sign-in-page.component.scss']
})
export class HypothesisSignInPageComponent implements OnInit {

  constructor(private app: AppService) { }

  ngOnInit(): void {
  }

  redirect() {
    this.app.continueAndRedirect();
  }

}
