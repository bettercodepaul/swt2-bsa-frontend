import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector:    'bla-grid-layout',
  templateUrl: './grid-layout.component.html',
  styleUrls:   ['./grid-layout.component.scss']
})
export class GridLayoutComponent implements OnInit {

  @Input() public alignCenter = false;

  constructor() {
  }

  ngOnInit() {
  }

}
