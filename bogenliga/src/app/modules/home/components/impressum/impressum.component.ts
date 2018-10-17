import {Component, OnInit} from '@angular/core';
import {IMPRESSUM_CONFIG} from './impressum.config';

@Component({
  selector:    'bla-impressum',
  templateUrl: './impressum.component.html',
  styleUrls:   ['./impressum.component.scss']
})
export class ImpressumComponent implements OnInit {

  public config = IMPRESSUM_CONFIG;
  constructor() {
  }

  ngOnInit() {
  }

}
