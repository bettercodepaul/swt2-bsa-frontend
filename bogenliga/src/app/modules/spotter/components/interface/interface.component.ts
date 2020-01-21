import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bla-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.scss']
})
export class InterfaceComponent implements OnInit {

  spotting = true;

  constructor() { }

  ngOnInit() {
  }

}
