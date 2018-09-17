import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../app.component';

@Component({
  selector: 'bla-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss',
              './../app.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public comp: AppComponent) { }

  ngOnInit() {
  }

}
