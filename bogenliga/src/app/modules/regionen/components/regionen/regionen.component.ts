import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {REGIONEN_CONFIG} from './regionen.config';
import Sunburst from 'sunburst-chart';

@Component({
  selector: 'bla-regionen',
  templateUrl: './regionen.component.html'
})
export class RegionenComponent implements OnInit {

  public config = REGIONEN_CONFIG;

  @ViewChild('chart') myDiv: ElementRef;

  constructor() {}

  ngOnInit() {
    this.loadSunburst();
  }

  loadSunburst() {
    const data = {
      name: 'main',
      color: 'magenta',
      children: [{
        name: 'a',
        color: 'yellow',
        size: 1
      }, {
        name: 'b',
        color: 'red',
        children: [{
          name: 'ba',
          color: 'orange',
          size: 1
        }, {
          name: 'bb',
          color: 'blue',
          children: [{
            name: 'bba',
            color: 'green',
            size: 1
          }, {
            name: 'bbb',
            color: 'pink',
            size: 1
          }]
        }]
      }]
    };


    Sunburst()
      .data(data)
      .size('size')
      .color('color')
      (this.myDiv.nativeElement);
  }
}
