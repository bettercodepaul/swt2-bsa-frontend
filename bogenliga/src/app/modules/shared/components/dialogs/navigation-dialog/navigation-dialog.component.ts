import {Component, Input, OnInit} from '@angular/core';
import {CommonComponent} from '../../common';
import {NavigationDialogConfig} from '../types/navigation-dialog-config.interface';

@Component({
  selector:    'bla-navigation-dialog',
  templateUrl: './navigation-dialog.component.html',
  styleUrls:   ['./navigation-dialog.component.scss']
})
export class NavigationDialogComponent extends CommonComponent implements OnInit {

  @Input() public config: NavigationDialogConfig;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
