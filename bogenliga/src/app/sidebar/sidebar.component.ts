import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../app.component';

@Component({
  selector: 'bla-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./../app.component.scss',
              './sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(public comp: AppComponent) { }

  ngOnInit() {
  }
}
