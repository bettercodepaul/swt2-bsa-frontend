import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector:    'bla-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls:   ['./dropdown.component.scss'],
})

export class DropdownComponent implements OnInit {

  @Output() public onAction = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit() {
  }

}
