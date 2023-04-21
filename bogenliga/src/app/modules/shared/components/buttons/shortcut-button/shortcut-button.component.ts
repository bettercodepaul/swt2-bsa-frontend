import {Component, Input, OnInit} from '@angular/core';
import {NavigationCardsConfig} from '@shared/components/navigation-cards';
import {
  ShortcutButtonsConfig
} from '@shared/components/buttons/shortcut-button/types/shortcut-buttons-config.interface';

@Component({
  selector: 'bla-shortcut-button',
  templateUrl: './shortcut-button.component.html',
  styleUrls: ['./shortcut-button.component.scss']
})
export class ShortcutButton implements OnInit {

  @Input()
  public id: string;
  constructor() { }

  @Input() public config: ShortcutButtonsConfig = {shortcutButtons: []};

  ngOnInit(): void {
  }

}
