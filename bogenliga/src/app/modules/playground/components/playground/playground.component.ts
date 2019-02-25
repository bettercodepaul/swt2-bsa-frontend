import {Component, OnInit} from '@angular/core';
import {PLAYGROUND_CONFIG} from './playground.config';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'bla-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {

  public config = PLAYGROUND_CONFIG;
  public inProd = environment.production;

  constructor() {
  }

  ngOnInit() {
  }

}
