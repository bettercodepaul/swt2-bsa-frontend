import { Component, OnInit} from '@angular/core';
import {AppComponent} from '../app.component';

@Component({
  selector: 'bla-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./../app.component.scss',
              './navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public comp: AppComponent) {}

  ngOnInit() {
  }

}
