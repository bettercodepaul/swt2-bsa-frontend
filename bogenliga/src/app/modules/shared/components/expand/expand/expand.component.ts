import { Component, Input, Output, EventEmitter } from '@angular/core';



@Component({
  selector: 'bla-expand',
  templateUrl: './expand.component.html',
  styleUrls: ['./expand.component.scss']
})
export class ExpandComponent {
  @Input() headerText: string;
  @Input() headerLink?: string;
  expanded: boolean = true;
  @Input() selectedItem: any;
  @Output() closeMenu: EventEmitter<void> = new EventEmitter<void>();
  @Output() itemSelected: EventEmitter<any> = new EventEmitter<any>();

  toggleExpand() {
    this.expanded = !this.expanded;
  }

  closeExpandMenu() {
    this.expanded = false;
    this.closeMenu.emit();
  }
  onItemSelected(event: any) {
    this.itemSelected.emit(event);
  }

}
