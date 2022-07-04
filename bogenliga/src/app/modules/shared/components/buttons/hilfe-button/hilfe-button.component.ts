import {OnInit, Input, Component} from '@angular/core';

import {faQuestion} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector:    'bla-hilfe-button',
  templateUrl: './hilfe-button.component.html',
})

export class HilfeButtonComponent implements OnInit {
  faQuestion = faQuestion;
  @Input() public id : string;
  @Input() public href : string;

  ngOnInit(): void {
  }
}
