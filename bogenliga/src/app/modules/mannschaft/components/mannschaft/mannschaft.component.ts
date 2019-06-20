import {Component, OnInit} from '@angular/core';
import {MANNSCHAFT_CONFIG} from './mannschaft.config';

@Component({
  selector: 'bla-mannschaft',
  templateUrl: './mannschaft.component.html'
})
export class MannschaftComponent implements OnInit {

  public config = MANNSCHAFT_CONFIG;

  constructor() {
  }

  ngOnInit() {
  }

}
