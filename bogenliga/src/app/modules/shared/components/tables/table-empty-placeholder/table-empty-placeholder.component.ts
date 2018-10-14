import {Component, Input, OnInit} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector:    '[bla-table-empty-placeholder]',
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
