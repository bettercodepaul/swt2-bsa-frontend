import { Component, OnInit } from '@angular/core';
import {VEREINE_CONFIG} from "./vereine.config";

@Component({
  selector: 'bla-vereine',
  templateUrl: './vereine.component.html',
  styleUrls: ['./vereine.component.scss']
})
export class VereineComponent implements OnInit {

  public config = VEREINE_CONFIG;

  constructor() { }

  ngOnInit() {
  }

}
