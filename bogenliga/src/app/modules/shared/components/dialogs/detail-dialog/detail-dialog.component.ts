import {Component, Input, OnInit} from '@angular/core';
import {CommonComponent} from '../../common-component.class';
import {DetailDialogConfig} from '../types/detail-dialog-config.interface';

@Component({
  selector:    'bla-detail-dialog',
  templateUrl: './detail-dialog.component.html',
  styleUrls:   ['./detail-dialog.component.scss']
})
export class DetailDialogComponent extends CommonComponent implements OnInit {

  @Input() public config: DetailDialogConfig;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
