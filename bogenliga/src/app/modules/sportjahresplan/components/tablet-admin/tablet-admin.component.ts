import {Component, OnInit} from '@angular/core';
import {TabletSessionDO} from '../../types/tablet-session-do.class';
import {isUndefined} from '../../../shared/functions';
import {BogenligaResponse} from '../../../shared/data-provider';
import {ActivatedRoute, Router} from '@angular/router';
import {TabletSessionProviderService} from '../../services/tablet-session-provider.service';

export const STORAGE_KEY_TABLET_SESSION = 'tabletSession';

const SESSION_INVALID_STORAGE_VALUES = ['[]', 'null', 'undefined'];
const MAX_NUM_SCHEIBEN = 8;

@Component({
  selector:    'bla-tablet-admin',
  templateUrl: './tablet-admin.component.html',
  styleUrls:   ['./tablet-admin.component.scss']
})
export class TabletAdminComponent implements OnInit {

  sessions: Array<TabletSessionDO>;
  currentDeviceIsActive = false;
  currentSession: TabletSessionDO;
  tabletEingabeRoute: string;
  AccessToken = 0;

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
              // new CM
              this.AccessToken = this.currentSession.accessToken;
            }, (error) => {
              console.error(error);
              // TESTWEISE DRIN, muss entfernt werden sobald backend service steht
              this.sessions = [];
              for (let i = 0; i < MAX_NUM_SCHEIBEN; i++) {
                this.sessions.push(new TabletSessionDO(i + 1, parseInt(wettkampfId, 10), false));
              }
              this.setActiveSession();
            });
      }
    });
  }

  public updateSession(scheibenNr: number) {
    const sessionToUpdate = this.sessions[scheibenNr - 1];
    sessionToUpdate.isActive = !sessionToUpdate.isActive;
    this.storeCurrentSession(sessionToUpdate);
    this.tabletSessionService.update(sessionToUpdate)
        .then((success) => {
          this.sessions[scheibenNr - 1] = this.currentSession = success.payload;
          this.storeCurrentSession(this.currentSession);
          // new CM
          this.AccessToken = this.currentSession.accessToken;
          this.setTabletEingabeRoute();
          if (this.currentDeviceIsActive && this.currentSession && this.currentSession.otherMatchId) {
            this.router.navigate([this.tabletEingabeRoute]);
          }
        }, (error) => {
          console.log(error);
        });
  }

  private setActiveSession() {
    const currentTabletSession = localStorage.getItem(STORAGE_KEY_TABLET_SESSION);
    this.currentDeviceIsActive = Boolean(currentTabletSession) &&
      SESSION_INVALID_STORAGE_VALUES.indexOf(currentTabletSession) < 0;
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
      this.tabletEingabeRoute = '/' + this.currentSession.matchID + '/' + this.currentSession.otherMatchId + '/tablet';
    }
  }

  private canNavigateToEingabe(session) {
    return (this.currentDeviceIsActive &&
      this.currentSession &&
      this.currentSession.otherMatchId &&
      this.currentSession.scheibenNr === session.scheibenNr);
  }
}
