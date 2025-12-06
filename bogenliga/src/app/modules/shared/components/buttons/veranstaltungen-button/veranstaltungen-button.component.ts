import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector:    'bla-veranstaltungen-button',
  templateUrl: './veranstaltungen-button.component.html',
  styleUrls: [
    './veranstaltungen-button.component.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class VeranstaltungenButtonComponent implements OnInit {

  @Input() public id: string;
  @Input() public href: string;

  public expanded = false;

  ngOnInit(): void {
  }

  public toggle(): void {
    this.expanded = !this.expanded;
  }
}
