import {InterfaceComponent} from './modules/spotter/components/interface/interface.component';
import {Component, Injectable, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import {environment} from '../environments/environment';
import {AppState, SidebarState} from './modules/shared/redux-store';
import {HttpHeaders} from '@angular/common/http';
import {FeedbackProviderService} from '@verwaltung/services/feedback-data-provider.service';
import { FullscreenComponent } from './modules/wkdurchfuehrung/components/fullscreen/fullscreen.component';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector:    'bla-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  public isActive: boolean;
  public fullscreen = false;

  popup: boolean;
  isAnonymous: boolean;
  marked: any;
  public feedbackTextArea: string;
  public emailTextArea: string;
  public feedbackAndEmail: string;

  constructor(private translate: TranslateService, private store: Store<AppState>, private router: Router, private feedbackDataProvider: FeedbackProviderService) {
    translate.setDefaultLang('de');
    translate.use('de');
    store.pipe(select((state) => state.sidebarState))
         .subscribe((state: SidebarState) => this.isActive = state.toggleSidebar);
  }

  public showLabel(): boolean {
    return environment.showLabel;
  }

  public getEnvironment(): string {
    return environment.label;
  }

  ngOnInit() {
    // scrolls up to top after page change
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        // trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  onActivate(event: any) {
    if (event instanceof InterfaceComponent) {
      this.fullscreen = true;
    }
    if (event instanceof FullscreenComponent) {
      this.fullscreen = true;
    }
  }

  onDeactivate(event: any) {
    if (event instanceof InterfaceComponent) {
      this.fullscreen = false;
    }
    if (event instanceof FullscreenComponent) {
      this.fullscreen = false;
    }
  }


  // Create new String with Feedback and the E-Mail address
  // then call the sendFeedback function to send the feedback
  // to the backend
  sendFeedback() {
    this.feedbackAndEmail = this.feedbackTextArea;
    // Check if user want to send it anonymous
    if ( !this.isAnonymous ) {
      this.feedbackAndEmail += ' ' + this.emailTextArea;
    }

    // make textareas empty again and call sendFeedback function
    this.emailTextArea = '';
    this.feedbackDataProvider.sendFeedback(this.feedbackAndEmail);
    this.feedbackTextArea = '';
    this.emailTextArea = '';
    this.popup = false;

  }

}
