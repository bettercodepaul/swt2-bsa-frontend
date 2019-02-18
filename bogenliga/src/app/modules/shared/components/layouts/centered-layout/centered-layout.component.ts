import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'bla-centered-layout',
  templateUrl: './centered-layout.component.html',
  styleUrls: ['./centered-layout.component.scss']
})
export class CenteredLayoutComponent implements OnInit {
  @Input() public width = 60;

  constructor() {
  }

  ngOnInit() {
  }

  public getMaxWidth(): object {
    return JSON.parse(`{"min-width":"${this.width}", "max-width":"${this.width}%"}`);
  }

  public getWith(): object {
    const width = (100 - this.width) / 2;
    return JSON.parse(`{"min-width":"${width}", "max-width":"${width}%"}`);
  }
}
