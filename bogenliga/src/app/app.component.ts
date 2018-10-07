import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {select, Store} from '@ngrx/store';
import {AppState, SidebarState} from './modules/shared/redux-store';

@Component({
  selector: 'bla-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bla';
  open =  '';

  public isActive: boolean;

  constructor(private translate: TranslateService, private store: Store<AppState>) {
    translate.setDefaultLang('de');
    store.pipe(select('sidebarState')).subscribe((state: SidebarState) => this.isActive = state.toggleSidebar );
  }
}


