import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector:    'bla-col-layout',
  templateUrl: './col-layout.component.html',
  styleUrls:   ['./col-layout.component.scss']
})
export class ColLayoutComponent implements OnInit {

  @Input() public style: string = null;

  constructor() {
  }

  ngOnInit() {
  }

}
