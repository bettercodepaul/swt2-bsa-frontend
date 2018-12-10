import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DsbMannschaftDO} from '../../../../verwaltung/types/dsb-mannschaft-do.class';
import {VereineDO} from '../../../../vereine/types/vereine-do.class';
import {Router} from '@angular/router';

@Component({
  selector:    'bla-vereine-dropdown',
  templateUrl: './vereine-dropdown.component.html',
  styleUrls:   ['./vereine-dropdown.component.scss'],
})

export class VereineDropdownComponent implements OnInit {

  @Output() onClick = new EventEmitter<any>();
  @Input() mannschaften: DsbMannschaftDO[] = [];
  @Input() currentVerein: VereineDO;

  public dropdownIsVisible = false;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  toggleDropdown() {
    this.dropdownIsVisible = !this.dropdownIsVisible;
  }

  public navigateToMannschaft(id: string) {
    this.router.navigateByUrl('/vereine/' + this.currentVerein.id + '/' + id);
    this.toggleDropdown();
  }
}
