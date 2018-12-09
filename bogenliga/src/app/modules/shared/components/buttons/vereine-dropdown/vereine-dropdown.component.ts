import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector:    'bla-vereine-dropdown',
  templateUrl: './vereine-dropdown.component.html',
  styleUrls:   ['./vereine-dropdown.component.scss'],
})

export class VereineDropdownComponent implements OnInit {

  @Output() onClick = new EventEmitter<any>();

  public dropdownIsVisible = false;

  constructor() {
  }

  ngOnInit() {
  }

  toggleDropdown() {
    this.dropdownIsVisible = !this.dropdownIsVisible;
  }
}
