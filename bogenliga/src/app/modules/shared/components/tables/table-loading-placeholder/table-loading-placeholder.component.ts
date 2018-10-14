import {Component, Input, OnInit} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector:    '[bla-table-loading-placeholder]',
  templateUrl: './table-loading-placeholder.component.html',
  providers:   [TranslatePipe]
})
export class TableLoadingPlaceholderComponent implements OnInit {

  @Input() visible = false;
  @Input() colspan: number;

  constructor() {
  }

  ngOnInit() {
  }

}
