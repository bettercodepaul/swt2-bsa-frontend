import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'bla-shortcut-button',
  templateUrl: './shortcut-button.component.html',
  styleUrls: ['./shortcut-button.component.scss']
})
export class ShortcutButton implements OnInit {



  @Input()
  public id: string;
  constructor() { }

  ngOnInit(): void {
  }

}
