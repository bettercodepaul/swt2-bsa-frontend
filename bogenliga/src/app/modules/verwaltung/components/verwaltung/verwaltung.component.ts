import {Component, OnInit} from '@angular/core';
import {VERWALTUNG_CONFIG} from './verwaltung.config';
import {VERWALTUNG_NAVIGATION_CONFIG} from './verwaltung-navigation.config';

@Component({
  selector:    'bla-verwaltung',
  templateUrl: './verwaltung.component.html',
  styleUrls:   ['./verwaltung.component.scss']
})
export class VerwaltungComponent implements OnInit {

  public config = VERWALTUNG_CONFIG;
  public navigationCards = VERWALTUNG_NAVIGATION_CONFIG;

  constructor() {
  }

  ngOnInit() {
  }


}
