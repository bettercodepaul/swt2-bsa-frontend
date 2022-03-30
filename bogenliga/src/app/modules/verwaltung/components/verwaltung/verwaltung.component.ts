import {Component, OnInit} from '@angular/core';
import {VERWALTUNG_CONFIG} from './verwaltung.config';

@Component({
  selector:    'bla-verwaltung',
  templateUrl: './verwaltung.component.html',
  styleUrls:   ['./verwaltung.component.scss']
})

export class VerwaltungComponent implements OnInit {
  public config = VERWALTUNG_CONFIG;

  constructor() {
  }

  ngOnInit() {
  }

}
