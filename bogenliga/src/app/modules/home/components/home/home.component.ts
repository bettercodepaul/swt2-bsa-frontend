import {Component, OnInit} from '@angular/core';
import {HOME_CONFIG} from './home.config';

@Component({
  selector:    'bla-home',
  templateUrl: './home.component.html',
  styleUrls:   [
    '../../../../app.component.scss',
    './home.component.scss'
  ]
})
export class HomeComponent implements OnInit {

  public config = HOME_CONFIG;

  constructor() {
  }

  ngOnInit() {
  }

}
