import { Component, OnInit } from '@angular/core';
import {HILFE_CONFIG} from './hilfe.config';

@Component({
  selector: 'bla-components',
  templateUrl: './hilfe.component.html',
  styleUrls: ['./hilfe.component.scss']
})
export class HilfeComponent implements OnInit {

  public config = HILFE_CONFIG;
  constructor() { }

  ngOnInit(): void {
  }

}
