import {Component, Input, OnInit} from '@angular/core';
import {OverviewDialogConfig} from '../types/overview-dialog-config.interface';
import {CommonComponent} from '../../common-component.class';

@Component({
  selector:    'bla-overview-dialog',
  templateUrl: './overview-dialog.component.html',
  styleUrls:   ['./overview-dialog.component.scss']
})
export class OverviewDialogComponent extends CommonComponent implements OnInit {

  @Input() public config: OverviewDialogConfig;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
