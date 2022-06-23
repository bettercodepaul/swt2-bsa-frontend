import {OnInit, Input, Component} from '@angular/core';

@Component({
  selector:    'bla-hilfe-button',
  templateUrl: './hilfe-button.component.html'
})

export class HilfeButtonComponent implements OnInit {

  @Input() public id : string;

  ngOnInit(): void {
  }
}
