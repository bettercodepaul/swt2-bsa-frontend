import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppComponent} from '../app.component';
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'bla-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./../app.component.scss',
              './navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input()
  public isActive: boolean;

  @Output()
  public toggle = new EventEmitter<void>();

  constructor(private translate: TranslateService) {}

  ngOnInit() {
  }

  public toggleNavbar() {
    this.toggle.emit();
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }
}
