import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'bla-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss',
              './../../app.component.scss']
})
export class SidebarComponent implements OnInit {

  @Input()
  public isActive: boolean;

  @Output()
  public toggle = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  public toggleSidebar() {
    this.toggle.emit();
  }
}
