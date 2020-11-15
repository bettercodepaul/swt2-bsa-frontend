import { InterfaceComponent } from './modules/spotter/components/interface/interface.component';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { AppState, SidebarState } from './modules/shared/redux-store';

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {WettkampfDataProviderService} from '@verwaltung/services/wettkampf-data-provider.service';
import {FeedbackProviderService} from '@verwaltung/services/feedback-data-provider.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'bla-root',
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

  baseurl: 'v1';
  feedbackurl: 'feedback'

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
  }

  onDeactivate(event: any) {
    if (event instanceof InterfaceComponent) {
      this.fullscreen = false;
    }
  }

  //Create new String with Feedback and the E-Mail address
  sendFeedback() {
    this.feedbackAndEmail = this.feedbackTextArea;
    if ( !this.isAnonymous ) {
        this.feedbackAndEmail += " " + this.emailTextArea
    }
    this.emailTextArea = "";
    this.feedbackDataProvider.sendFeedback(this.feedbackAndEmail);
  }

}
