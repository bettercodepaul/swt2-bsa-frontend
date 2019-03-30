import {Component, Input, OnInit} from '@angular/core';
import {CommonComponent} from '../../common';
import {NavigationCardsConfig} from '../types/navigation-cards-config.interface';

@Component({
  selector:    'bla-navigation-cards',
  templateUrl: './navigation-cards.component.html',
  styleUrls:   ['./navigation-cards.component.scss']
})
export class NavigationCardsComponent extends CommonComponent implements OnInit {

  @Input() public config: NavigationCardsConfig = {navigationCards: []};

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
