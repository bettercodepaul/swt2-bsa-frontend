import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DsbMannschaftDO} from '../../../../verwaltung/types/dsb-mannschaft-do.class';
import {VereineDO} from '../../../../vereine/types/vereine-do.class';

@Component({
  selector: 'bla-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})

export class DropdownComponent implements OnInit {

  @Input() mannschaften: DsbMannschaftDO[] = [];
  @Input() currentVerein: VereineDO;
  @Output() clicked: EventEmitter<string> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  private onClick(id: string) {
    this.clicked.emit(id);
  }

}
