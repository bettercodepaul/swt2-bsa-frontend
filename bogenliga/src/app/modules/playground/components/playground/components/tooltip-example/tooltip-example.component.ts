import {Component, OnInit} from '@angular/core';
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'bla-tooltip-example',
  templateUrl: './tooltip-example.component.html',
  styleUrls: ['./tooltip-example.component.scss']
})
export class TooltipExampleComponent implements OnInit {

  public infoIcon = faInfoCircle;
  public infoTooltipText = 'Info Tooltip Text';

  constructor() {
  }

  ngOnInit() {
  }

  public getTooltipText(): string {
    return 'Button Tooltip Text';
  }
}
