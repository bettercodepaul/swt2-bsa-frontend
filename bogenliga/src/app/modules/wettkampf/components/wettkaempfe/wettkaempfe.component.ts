import {Component, OnInit} from '@angular/core';
import {WETTKAEMPFE_CONFIG} from './wettkaempfe.config';
import {Router} from '@angular/router';

@Component({
  selector:    'bla-wettkaempfe',
  templateUrl: './wettkaempfe.component.html',
  styleUrls:   [
    './../../../../app.component.scss',
    './wettkaempfe.component.scss'
  ]
})
export class WettkaempfeComponent implements OnInit {

  public config = WETTKAEMPFE_CONFIG;

  constructor() {
  }

  ngOnInit() {
  }

}
