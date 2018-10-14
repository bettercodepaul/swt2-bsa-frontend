import {Component, Input, OnInit} from '@angular/core';
import {CommonDialogConfig} from '..';
import {CommonComponent} from '../../common';

@Component({
  selector:    'bla-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls:   ['./common-dialog.component.scss']
})
export class CommonDialogComponent extends CommonComponent implements OnInit {

  @Input() public config: CommonDialogConfig;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
