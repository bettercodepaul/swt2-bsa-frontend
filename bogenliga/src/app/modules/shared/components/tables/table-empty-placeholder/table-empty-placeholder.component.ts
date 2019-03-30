import {Component, Input, OnInit} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  /* tslint:disable */
  selector:    '[bla-table-empty-placeholder]',
  /* tslint:enable */
  templateUrl: './table-empty-placeholder.component.html',
  providers:   [TranslatePipe]
})
export class TableEmptyPlaceholderComponent implements OnInit {

  @Input() visible = false;
  @Input() colspan: number;

  constructor() {
  }

  ngOnInit() {
  }

}
