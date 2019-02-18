import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DsbMannschaftDO} from '../../../../verwaltung/types/dsb-mannschaft-do.class';
import {VereineDO} from '../../../../vereine/types/vereine-do.class';
import {VersionedDataObject} from '../../../data-provider/models/versioned-data-object.interface';

@Component({
  selector: 'bla-vereine-dropdown',
  templateUrl: './vereine-dropdown.component.html',
  styleUrls: ['./vereine-dropdown.component.scss'],
})

export class VereineDropdownComponent implements OnInit {

  @Output() onMannschaftClick = new EventEmitter<any>();
  @Input() mannschaften: DsbMannschaftDO[] = [];
  @Input() currentVerein: VereineDO;

  public dropdownIsVisible = false;

  constructor() {
  }

  ngOnInit() {
  }

  toggleDropdown() {
    this.dropdownIsVisible = !this.dropdownIsVisible;
  }

  public onClick(versionedDataObject: VersionedDataObject) {
    this.onMannschaftClick.emit(versionedDataObject);
  }
}
