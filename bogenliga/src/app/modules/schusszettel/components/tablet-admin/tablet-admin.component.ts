import {Component, OnInit} from '@angular/core';
import {TabletSessionDO} from '../../types/tablet-session-do.class';
import {isUndefined} from '@shared/functions';
import {BogenligaResponse} from '@shared/data-provider';
import {ActivatedRoute, Router} from '@angular/router';
import {TabletSessionProviderService} from '../../services/tablet-session-provider.service';

export const STORAGE_KEY_TABLET_SESSION: string = 'tabletSession';

const SESSION_INVALID_STORAGE_VALUES = ['[]', 'null', 'undefined'];

@Component({
  selector:    'bla-tablet-admin',
  templateUrl: './tablet-admin.component.html',
  styleUrls:   ['./tablet-admin.component.scss']
})
export class TabletAdminComponent implements OnInit {

  sessions: Array<TabletSessionDO>;
  currentDeviceIsActive: boolean = false;
  currentSession: TabletSessionDO;
  tabletEingabeRoute: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tabletSessionService: TabletSessionProviderService) {
  }

  /**
   * Called when component is initialized.
   *
   */
  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (!isUndefined(params['wettkampfId'])) {
        const wettkampfId = params['wettkampfId'];
        this.tabletSessionService.findAllTabletSessions(wettkampfId)
            .then((data: BogenligaResponse<Array<TabletSessionDO>>) => {
              this.sessions = data.payload;
              this.setActiveSession();
              this.setTabletEingabeRoute();
            }, (error) => {
              console.error(error);
              // TESTWEISE DRIN, muss entfernt werden sobald backend service steht
              this.sessions = [];
              for (let i = 0; i < 8; i++) {
                this.sessions.push(new TabletSessionDO(i + 1, parseInt(wettkampfId), false));
              }
              this.setActiveSession();
            });
      }
    });
  }

  public updateSession(scheibenNr: number) {
    let sessionToUpdate = this.sessions[scheibenNr - 1];
    sessionToUpdate.isActive = !sessionToUpdate.isActive;
    this.storeCurrentSession(sessionToUpdate);
    this.tabletSessionService.update(sessionToUpdate)
        .then((success) => {
          this.sessions[scheibenNr - 1] = this.currentSession = success.payload;
          this.storeCurrentSession(this.currentSession);
          this.setTabletEingabeRoute();
          if (this.currentDeviceIsActive && this.currentSession && this.currentSession.otherMatchId) {
            this.router.navigate([this.tabletEingabeRoute]);
          }
        }, (error) => {
          console.log(error);
        })
  }

  private setActiveSession() {
    let currentTabletSession = localStorage.getItem(STORAGE_KEY_TABLET_SESSION);
    this.currentDeviceIsActive = Boolean(currentTabletSession) &&
      SESSION_INVALID_STORAGE_VALUES.indexOf(currentTabletSession) < 0;
    console.log('LOCALSTORAGE CURRENTDEVICE', this.currentDeviceIsActive);
    if (this.currentDeviceIsActive) {
      this.currentSession = JSON.parse(currentTabletSession);
      this.sessions[this.currentSession.scheibenNr - 1] = this.currentSession;
    }
  }

  private storeCurrentSession(session: TabletSessionDO) {
    if (session.isActive) {
      localStorage.setItem(STORAGE_KEY_TABLET_SESSION, JSON.stringify(session));
      this.currentDeviceIsActive = true;
    } else {
      localStorage.removeItem(STORAGE_KEY_TABLET_SESSION);
      this.currentDeviceIsActive = false;
    }
  }

  private setTabletEingabeRoute() {
    if (this.currentSession) {
      this.tabletEingabeRoute = '/schusszettel/' + this.currentSession.matchID + '/' + this.currentSession.otherMatchId + '/tablet';
    }
  }

  private canNavigateToEingabe(session) {
    return this.currentDeviceIsActive &&
      this.currentSession &&
      this.currentSession.otherMatchId &&
      this.currentSession.scheibenNr === session.scheibenNr
  }
}
