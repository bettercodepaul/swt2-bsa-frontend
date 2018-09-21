import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppComponent} from '../../app.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'bla-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss',
              './../../app.component.scss']
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

  /**
   * Changes the language used on the Website
   * @param language
   */
  useLanguage(language: string) {
    this.translate.use(language);
  }
}
