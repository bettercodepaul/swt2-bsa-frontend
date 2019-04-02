import {Component, OnInit} from '@angular/core';
import {REGIONEN_CONFIG} from './regionen.config';

@Component({
  selector: 'bla-regionen',
  templateUrl: './regionen.component.html'
})
export class RegionenComponent implements OnInit {

  public config = REGIONEN_CONFIG;

  constructor() {
  }

  ngOnInit() {
  }

}
