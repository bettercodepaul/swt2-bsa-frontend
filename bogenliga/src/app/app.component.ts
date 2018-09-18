import { Component, Output, EventEmitter } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'bla-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bla';
  open =  '';

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('de');
  }

  public isActive = true;

  public toggle(): void {
    this.isActive = !this.isActive;
  }


}


