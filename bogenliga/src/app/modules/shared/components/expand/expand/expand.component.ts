import { Component, Input } from '@angular/core';

@Component({
  selector: 'bla-expand',
  templateUrl: './expand.component.html',
  styleUrls: ['./expand.component.scss']
})

export class ExpandComponent {
  @Input() headerText: string;
  @Input() headerLink?: string;
  expanded: boolean = false;

  toggleExpand() {
    this.expanded = !this.expanded;
  }
}



