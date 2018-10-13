import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {select, Store} from '@ngrx/store';
import {AppState, SidebarState} from './modules/shared/redux-store';
import {NavigationEnd, Router} from '@angular/router';
import {faBars, faCoffee} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector:    'bla-root',
  templateUrl: './app.component.html',
  styleUrls:   ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'bla';
  open = '';
  faCoffee = faCoffee;
  faBars = faBars;

  public isActive: boolean;

  constructor(private translate: TranslateService, private store: Store<AppState>, private router: Router) {
    translate.setDefaultLang('de');
    store.pipe(select('sidebarState')).subscribe((state: SidebarState) => this.isActive = state.toggleSidebar);
  }

  ngOnInit() {
    // scrolls up to top after page change
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }
}


