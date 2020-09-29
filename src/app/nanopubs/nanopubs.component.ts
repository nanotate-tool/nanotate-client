import { Component, OnInit } from '@angular/core';
import { AppService } from '../services';

@Component({
  templateUrl: './nanopubs.component.html'
})
export class NanopubsComponent implements OnInit {

  constructor(private app:AppService) { }

  ngOnInit(): void {
  }

}
